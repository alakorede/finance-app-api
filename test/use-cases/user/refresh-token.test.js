import { RefreshTokenUseCase } from "../../../src/use-cases/index.js"
import { UnauthorizedError } from "../../../src/errors/user.js"

describe("RefreshTokenUseCase", () => {
    class TokensGeneratorAdapterStub {
        execute() {
            return {
                accessToken: "any_access_token",
                refreshToken: "any_refresh_token",
            }
        }
    }

    class TokenVerifierAdapterStub {
        execute() {
            return true
        }
    }

    const makeSut = () => {
        const tokensGeneratorAdapter = new TokensGeneratorAdapterStub()
        const tokenVerifierAdapter = new TokenVerifierAdapterStub()
        const sut = new RefreshTokenUseCase(
            tokensGeneratorAdapter,
            tokenVerifierAdapter,
        )

        return { sut, tokensGeneratorAdapter, tokenVerifierAdapter }
    }

    test("Should refresh tokens", () => {
        const { sut } = makeSut()
        const refreshToken = "any_refresh_token"

        const result = sut.execute(refreshToken)

        expect(result).toEqual({
            accessToken: "any_access_token",
            refreshToken: "any_refresh_token",
        })
    })

    test("Should throw if tokenVerifierAdapter do not validate token", () => {
        const { sut, tokenVerifierAdapter } = makeSut()

        import.meta.jest
            .spyOn(tokenVerifierAdapter, "execute")
            .mockReturnValueOnce(null)

        expect(() => sut.execute("any_refresh_token")).toThrow(
            new UnauthorizedError(),
        )
    })
})
