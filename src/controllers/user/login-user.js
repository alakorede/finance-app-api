import { ZodError } from "zod"
import { serverReturn, internalServerError } from "../helpers/index.js"
import { loginSchema } from "../../schemas/index.js"

export class LoginUserController {
    constructor(loginUserUseCase) {
        this.loginUserUseCase = loginUserUseCase
    }
    async execute(httpRequest) {
        try {
            const params = httpRequest.body

            await loginSchema.parseAsync(params)

            const user = await this.loginUserUseCase.execute(
                params.email,
                params.password,
            )
            return serverReturn(200, user)
        } catch (e) {
            if (e instanceof ZodError) {
                return serverReturn(400, { message: e.errors[0].message })
            }

            return internalServerError()
        }
    }
}
