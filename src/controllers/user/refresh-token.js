import { ZodError } from "zod"
import {
    unauthorizedResponse,
    serverReturn,
    internalServerError,
} from "../helpers/index.js"

import jwt from "jsonwebtoken"

import { refreshTokenSchema } from "../../schemas/index.js"
import { UnauthorizedError } from "../../errors/user.js"

export class RefreshTokenController {
    constructor(refreshTokenUseCase) {
        this.refreshTokenUseCase = refreshTokenUseCase
    }

    async execute(httpRequest) {
        try {
            const params = httpRequest.body

            await refreshTokenSchema.parseAsync(params)

            const refreshedToken = this.refreshTokenUseCase.execute(
                params.refreshToken,
            )

            if (!refreshedToken) {
                return unauthorizedResponse()
            }

            return serverReturn(200, refreshedToken)
        } catch (e) {
            if (e instanceof ZodError) {
                return serverReturn(400, { message: e.errors[0].message })
            }

            if (
                e instanceof UnauthorizedError ||
                e instanceof jwt.JsonWebTokenError
            ) {
                return unauthorizedResponse()
            }

            console.error("RefreshTokenController error:", e)
            return internalServerError()
        }
    }
}
