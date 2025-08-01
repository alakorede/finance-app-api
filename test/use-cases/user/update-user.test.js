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

        return { updateUserRepository, getUserByEmailRepository, sut }
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

    //invalid email
    //valid password
    //invalid password
    //user does not exists
    //throw/throws
})
