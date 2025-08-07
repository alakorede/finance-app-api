import jwt from "jsonwebtoken"

export class TokensGeneratorAdapter {
    execute(userId) {
        return {
            accessToken: jwt.sign(
                { userId },
                process.env.JWT_ACCESS_TOKEN_SECRE,
                { expiresIn: "15m" },
            ),
            refreshToken: jwt.sign(
                { userId },
                process.env.JWT_REFRESH_TOKEN_SECRE,
                { expiresIn: "30d" },
            ),
        }
    }
}
