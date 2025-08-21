import { internalServerError, serverReturn } from "../helpers/index.js"
import { getUserBalanceSchema } from "../../schemas/index.js"
import { ZodError } from "zod"

export class GetUserBalanceController {
    constructor(getUserBalanceUseCase) {
        this.getUserBalanceUseCase = getUserBalanceUseCase
    }
    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId
            const from = httpRequest.query.from
            const to = httpRequest.query.to

            await getUserBalanceSchema.parseAsync({
                userId,
                from,
                to,
            })

            const userBalanceInfo = await this.getUserBalanceUseCase.execute(
                userId,
                from,
                to,
            )

            return serverReturn(200, userBalanceInfo)
        } catch (e) {
            if (e instanceof ZodError) {
                return serverReturn(400, { message: e.errors[0].message })
            }
            console.error("GetUserBalanceController error:", e)
            return internalServerError()
        }
    }
}
