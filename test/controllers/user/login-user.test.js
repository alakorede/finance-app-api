import { LoginUserController } from "../../../src/controllers/user/login-user.js"
import { faker } from "@faker-js/faker"
import {
    InvalidPasswordError,
    UserNotFoundError,
} from "../../../src/errors/user.js"

describe("LoginUserController", () => {
    const user = {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 7 }),
    }

    class LoginUserUseCaseStub {
        async execute() {
            return {
                ...user,
                tokens: {
                    accessToken: "access_token",
                    refreshToken: "refresh_Token",
                },
            }
        }
    }

    const httpRequest = {
        body: {
            email: user.email,
            password: user.password,
        },
    }

    const makeSut = () => {
        const loginUserUseCase = new LoginUserUseCaseStub()
        const sut = new LoginUserController(loginUserUseCase)
        return { sut, loginUserUseCase }
    }

    test("Should return user data with accessToken and refreshToken on success", async () => {
        const { sut } = makeSut()

        const response = await sut.execute(httpRequest)

        expect(response.statusCode).toBe(200)
        expect(response.body).toHaveProperty("id")
        expect(response.body.tokens.accessToken).toBe("access_token")
        expect(response.body.tokens.refreshToken).toBe("refresh_Token")
    })

    test("Should return statusCode 401 on InvalidPasswordError", async () => {
        const { sut, loginUserUseCase } = makeSut()

        import.meta.jest
            .spyOn(loginUserUseCase, "execute")
            .mockRejectedValueOnce(new InvalidPasswordError())

        const response = await sut.execute(httpRequest)
        expect(response.statusCode).toBe(401)
    })

    test("Should return statusCode 404 on UserNotFoundError", async () => {
        const { sut, loginUserUseCase } = makeSut()

        import.meta.jest
            .spyOn(loginUserUseCase, "execute")
            .mockRejectedValueOnce(new UserNotFoundError())

        const response = await sut.execute(httpRequest)
        expect(response.statusCode).toBe(404)
    })
})
