import {
    UserNotFoundError,
    InvalidPasswordError,
} from "../../../src/errors/user.js"
import { LoginUserUseCase } from "../../../src/use-cases/index.js"
import { faker } from "@faker-js/faker"

describe("LoginUserUseCase", () => {
    const user = {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 7 }),
    }

    class PasswordComparatorAdapter {
        execute() {
            return true
        }
    }

    class GetUserByEmailRepository {
        async execute() {
            return user
        }
    }

    class TokensGeneratorAdapterStub {
        execute() {
            return {
                accessToken: "acessToken",
                refreshToken: "refreshToken",
            }
        }
    }

    const makeSut = () => {
        const passwordComparatorAdapter = new PasswordComparatorAdapter()
        const getUserByEmailRepositoryStub = new GetUserByEmailRepository()
        const tokensGeneratorAdapter = new TokensGeneratorAdapterStub()
        const sut = new LoginUserUseCase(
            getUserByEmailRepositoryStub,
            passwordComparatorAdapter,
            tokensGeneratorAdapter,
        )
        return { sut, getUserByEmailRepositoryStub, passwordComparatorAdapter }
    }
    test("Should throw UserNotFoundError if user is not found", async () => {
        const { sut, getUserByEmailRepositoryStub } = makeSut()

        import.meta.jest
            .spyOn(getUserByEmailRepositoryStub, "execute")
            .mockResolvedValueOnce(null)

        const promise = sut.execute("any_email", "any_password")

        await expect(promise).rejects.toThrow(new UserNotFoundError())
    })

    test("Should throw InvalidPasswordError if password is not equal user password", async () => {
        const { sut, passwordComparatorAdapter } = makeSut()

        import.meta.jest
            .spyOn(passwordComparatorAdapter, "execute")
            .mockReturnValueOnce(false)
        const promise = sut.execute("password", "user_password")

        await expect(promise).rejects.toThrow(new InvalidPasswordError())
    })

    test("Should return accessToken, refreshToken and userData on the whole processing success", async () => {
        const { sut } = makeSut()

        const result = await sut.execute("any_email", "any_password")

        expect(result.tokens.accessToken).toBeDefined()
        expect(result.tokens.refreshToken).toBeDefined()
    })
})
