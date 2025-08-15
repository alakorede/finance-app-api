import { UnauthorizedError } from "../../errors/user.js"
export class RefreshTokenUseCase {
    constructor(tokensGeneratorAdapter, tokenVerifierAdapter) {
        this.tokensGeneratorAdapter = tokensGeneratorAdapter
        this.tokenVerifierAdapter = tokenVerifierAdapter
    }

    execute(refreshToken) {
        const isTokenValid = this.tokenVerifierAdapter.execute(
            refreshToken,
            process.env.JWT_REFRESH_TOKEN_SECRET,
        )

        if (!isTokenValid) {
            throw new UnauthorizedError()
        }

        return this.tokensGeneratorAdapter.execute(isTokenValid.userId)
    }
}
