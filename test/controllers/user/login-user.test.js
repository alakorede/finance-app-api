import { LoginUserController } from "../../../src/controllers/user/login-user.js"

import { faker } from "@faker-js/faker"

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
                accessToken: "access_token",
                refreshToken: "refresh_Token",
            }
        }
    }

    const makeSut = () => {
        const loginUserUseCase = new LoginUserUseCaseStub()
        const sut = new LoginUserController(loginUserUseCase)
        return { sut, loginUserUseCase }
    }

    test("Should return user data with accessToken and refreshToken on success", async () => {
        const { sut } = makeSut()

        const httpRequest = {
            body: {
                email: user.email,
                password: user.password,
            },
        }

        const response = await sut.execute(httpRequest)

        expect(response.statusCode).toBe(200)
        expect(response.body).toHaveProperty("id")
        expect(response.body).toHaveProperty("accessToken")
        expect(response.body).toHaveProperty("refreshToken")
    })
})
