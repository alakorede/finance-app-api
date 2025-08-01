import { EmailAlreadyInUseError } from "../../../src/errors/user.js"
import { UpdateUserUseCase } from "../../../src/use-cases/index.js"
import { faker } from "@faker-js/faker"

describe("UpdateUserUseCase", () => {
    const user = {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 7 }),
    }

    class GetUserByEmailRepositoryStub {
        async execute() {
            return null
        }
    }

    class UpdateUserRepositoryStub {
        async execute() {
            return user
        }
    }

    class PasswordHasherAdapterStub {
        hash() {
            return "hashed_password"
        }
    }

    const makeSut = () => {
        const getUserByEmailRepository = new GetUserByEmailRepositoryStub()
        const updateUserRepository = new UpdateUserRepositoryStub()
        const passwordHasherAdapter = new PasswordHasherAdapterStub()

        const sut = new UpdateUserUseCase(
            updateUserRepository,
            getUserByEmailRepository,
            passwordHasherAdapter,
        )

        return {
            updateUserRepository,
            getUserByEmailRepository,
            passwordHasherAdapter,
            sut,
        }
    }

    test("Should update user successfully (without e-mail and password)", async () => {
        //arrange
        const { sut } = makeSut()
        const userId = faker.string.uuid()
        //act
        const result = await sut.execute(userId, {
            first_name: user.first_name,
            last_name: user.last_name,
        })
        //assert
        expect(result).toBeTruthy
        expect(result).toEqual(user)
    })

    test("Should update user successfully with valid e-mail", async () => {
        //arrange
        const { sut, getUserByEmailRepository } = makeSut()
        const userId = faker.string.uuid()

        const getUserByEmailRepositorySpy = jest.spyOn(
            getUserByEmailRepository,
            "execute",
        )

        const email = faker.internet.email()

        //act
        const result = await sut.execute(userId, {
            email,
        })
        //assert
        expect(getUserByEmailRepositorySpy).toHaveBeenCalledWith(email)
        expect(result).toEqual(user)
    })

    test("Should update user successfully with valid e-password", async () => {
        //arrange
        const { passwordHasherAdapter, sut } = makeSut()
        const userId = faker.string.uuid()

        const passwordHasherAdapterSpy = jest.spyOn(
            passwordHasherAdapter,
            "hash",
        )

        const password = faker.internet.password({ length: 7 })

        //act
        const result = await sut.execute(userId, {
            password,
        })
        //assert
        expect(passwordHasherAdapterSpy).toHaveBeenCalledWith(password)
        expect(result).toEqual(user)
    })
    test("Should throw EmailAlreadyInUseError if email is already in use", async () => {
        //arrange
        const { getUserByEmailRepository, sut } = makeSut()
        jest.spyOn(getUserByEmailRepository, "execute").mockResolvedValue(user)
        //act
        const promise = sut.execute(faker.string.uuid(), {
            email: user.email,
        })
        //assert
        await expect(promise).rejects.toThrow(new EmailAlreadyInUseError())
    })

    test("Should call UpdateUserReopository with correct params", async () => {
        //arrange
        const { sut, updateUserRepository } = makeSut()
        const updateUserRepositorySpy = jest.spyOn(
            updateUserRepository,
            "execute",
        )
        //act
        await sut.execute(user.id, {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            password: user.password,
        })
        //assert
        expect(updateUserRepositorySpy).toHaveBeenCalledWith(user.id, {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            password: "hashed_password",
        })
    })

    test("Should throw if GetUserByEmailRepository throws", async () => {
        //arrange
        const { getUserByEmailRepository, sut } = makeSut()
        jest.spyOn(getUserByEmailRepository, "execute").mockRejectedValueOnce(
            new Error(),
        )
        //act
        const promise = sut.execute(faker.string.uuid(), {
            email: user.email,
        })

        //assert
        await expect(promise).rejects.toThrow()
    })

    test("Should throw if GetUserByEmailRepository throws", async () => {
        //arrange
        const { passwordHasherAdapter, sut } = makeSut()
        jest.spyOn(passwordHasherAdapter, "hash").mockRejectedValueOnce(
            new Error(),
        )
        //act
        const promise = sut.execute(faker.string.uuid(), {
            password: user.password,
        })

        //assert
        await expect(promise).rejects.toThrow()
    })

    test("Should throw if GetUserByEmailRepository throws", async () => {
        //arrange
        const { updateUserRepository, sut } = makeSut()
        jest.spyOn(updateUserRepository, "execute").mockRejectedValueOnce(
            new Error(),
        )
        //act
        const promise = sut.execute(faker.string.uuid(), {
            first_name: user.first_name,
            last_name: user.last_name,
        })

        //assert
        await expect(promise).rejects.toThrow()
    })
})
