import { RefreshTokenController } from "../../../src/controllers/index.js"
import { UnauthorizedError } from "../../../src/errors/user.js"

describe("RefreshTokenController", () => {
    class RefreshTokenUseCaseStub {
        execute() {
            return {
                accessToken: "valid_access_token",
                refreshToken: "valid_refresh_token",
            }
        }
    }

    const makeSut = () => {
        const refreshTokenUseCase = new RefreshTokenUseCaseStub()
        const sut = new RefreshTokenController(refreshTokenUseCase)

        return { sut, refreshTokenUseCase }
    }

    test("Should return statusCode 200 and an object with new accessToken and refreshedToken", async () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                refreshToken: "oldRefreshToken",
            },
        }

        const response = await sut.execute(httpRequest)

        expect(response.statusCode).toBe(200)
        expect(response.body.accessToken).toBeDefined()
        expect(response.body.refreshToken).toBeDefined()
    })

    test("Should return statusCode 400 if refreshToken is invalid", async () => {
        const { sut } = makeSut()

        const httpRequest = {
            body: {
                refreshToken: 0,
            },
        }

        const response = await sut.execute(httpRequest)

        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBe(
            "Provide a valid refresh token format.",
        )
    })

    test("Should return 401 and unauthorized message if RefreshTokenUseCase throws Unauthorized error", async () => {
        const { sut, refreshTokenUseCase } = makeSut()

        const httpRequest = {
            body: {
                refreshToken: "old_refreshToken",
            },
        }

        import.meta.jest
            .spyOn(refreshTokenUseCase, "execute")
            .mockImplementationOnce(() => {
                new UnauthorizedError()
            })

        const response = await sut.execute(httpRequest)
        expect(response.statusCode).toBe(401)
        expect(response.body.message).toBe("Unauthorized")
    })

    test("Should return 500 on internal server error", async () => {
        const { sut, refreshTokenUseCase } = makeSut()

        const httpRequest = {
            body: {
                refreshToken: "old_refreshToken",
            },
        }

        import.meta.jest
            .spyOn(refreshTokenUseCase, "execute")
            .mockImplementationOnce(() => {
                throw new Error()
            })

        const response = await sut.execute(httpRequest)
        expect(response.statusCode).toBe(500)
        expect(response.body.message).toBe("Internal Server Error")
    })
})
