import { CreateUserUseCase } from "../../../src/use-cases/index.js"
import { EmailAlreadyInUseError } from "../../../src/errors/user.js"
import { faker } from "@faker-js/faker"

describe("CreateUserUseCase", () => {
    const createUserParams = {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 7 }),
    }

    class GetUserByEmailRepository {
        async execute() {
            return null
        }
    }

    class CreateUserRepositoryStub {
        async execute(user) {
            return user
        }
    }

    class PasswordHasherAdapterStub {
        hash() {
            return "hashed_password"
        }
    }

    class IdGeneratorAdapterStub {
        execute() {
            return "generated_id"
        }
    }

    class TokensGeneratorAdapterStub {
        execute() {
            return {
                accessToken: "any_access_token",
                refreshToken: "any_refresh_token",
            }
        }
    }

    const makeSut = () => {
        const getUserByEmailRepository = new GetUserByEmailRepository()
        const createUserRepository = new CreateUserRepositoryStub()
        const passwordHasherAdapter = new PasswordHasherAdapterStub()
        const idGeneratorAdapter = new IdGeneratorAdapterStub()
        const tokensGeneratorAdapter = new TokensGeneratorAdapterStub()

        const sut = new CreateUserUseCase(
            getUserByEmailRepository,
            createUserRepository,
            passwordHasherAdapter,
            idGeneratorAdapter,
            tokensGeneratorAdapter,
        )

        return {
            getUserByEmailRepository,
            createUserRepository,
            passwordHasherAdapter,
            idGeneratorAdapter,
            tokensGeneratorAdapter,
            sut,
        }
    }

    test("Should successfully create a user when all data is ok and there is no the same e-mail on DB", async () => {
        //arrange
        const { sut } = makeSut()

        //act
        const result = await sut.execute(createUserParams)

        //assert
        expect(result).toBeTruthy
        expect.objectContaining(result)
        expect(result.tokens.accessToken).toBeDefined()
        expect(result.tokens.refreshToken).toBeDefined()
    })

    test("Should return throw EmailAlreadyInUseError if GetUserByEmailRepository returns a user on search", async () => {
        //arrange
        const { getUserByEmailRepository, sut } = makeSut()
        import.meta.jest
            .spyOn(getUserByEmailRepository, "execute")
            .mockReturnValueOnce(createUserParams)
        //act
        const promise = sut.execute(createUserParams)
        //assert
        await expect(promise).rejects.toThrow(new EmailAlreadyInUseError())
    })

    test("Should call IdGeneratorAdapter to generate a random id and pass the new id to CreateUserRepository", async () => {
        //arrange
        const { idGeneratorAdapter, createUserRepository, sut } = makeSut()
        const idGeneratorSpy = import.meta.jest.spyOn(
            idGeneratorAdapter,
            "execute",
        )
        const createUserRepositorySpy = import.meta.jest.spyOn(
            createUserRepository,
            "execute",
        )

        //act
        await sut.execute(createUserParams)

        //assert
        expect(idGeneratorSpy).toHaveBeenCalled
        expect(createUserRepositorySpy).toHaveBeenCalledWith({
            ...createUserParams,
            password: "hashed_password",
            id: "generated_id",
        })
    })

    test("Should call PasswordHasherAdapter to generate a random id and pass the password to CreateUserRepository", async () => {
        //arrange
        const { passwordHasherAdapter, createUserRepository, sut } = makeSut()
        const passwordHasherAdapterSpy = import.meta.jest.spyOn(
            passwordHasherAdapter,
            "hash",
        )
        const createUserRepositorySpy = import.meta.jest.spyOn(
            createUserRepository,
            "execute",
        )

        //act
        await sut.execute(createUserParams)

        //assert
        expect(passwordHasherAdapterSpy).toHaveBeenCalled
        expect(createUserRepositorySpy).toHaveBeenCalledWith({
            ...createUserParams,
            password: "hashed_password",
            id: "generated_id",
        })
    })

    test("Should throw if GetUserByEmailRepository trows", async () => {
        //arrange
        const { getUserByEmailRepository, sut } = makeSut()
        import.meta.jest
            .spyOn(getUserByEmailRepository, "execute")
            .mockRejectedValueOnce(new Error())

        //act
        const promise = sut.execute(createUserParams)

        //assert
        await expect(promise).rejects.toThrow()
    })

    test("Should throw if IdGeneratorAdapter trows", async () => {
        //arrange
        const { idGeneratorAdapter, sut } = makeSut()
        import.meta.jest
            .spyOn(idGeneratorAdapter, "execute")
            .mockImplementationOnce(() => {
                throw new Error()
            })

        //act
        const promise = sut.execute(createUserParams)

        //assert
        await expect(promise).rejects.toThrow()
    })

    test("Should throw if IdGeneratorAdapter trows", async () => {
        //arrange
        const { passwordHasherAdapter, sut } = makeSut()
        import.meta.jest
            .spyOn(passwordHasherAdapter, "hash")
            .mockImplementationOnce(() => {
                throw new Error()
            })

        //act
        const promise = sut.execute(createUserParams)

        //assert
        await expect(promise).rejects.toThrow()
    })

    test("Should throw if createUserRepository trows", async () => {
        //arrange
        const { createUserRepository, sut } = makeSut()
        import.meta.jest
            .spyOn(createUserRepository, "execute")
            .mockImplementationOnce(() => {
                throw new Error()
            })

        //act
        const promise = sut.execute(createUserParams)

        //assert
        await expect(promise).rejects.toThrow()
    })
})
