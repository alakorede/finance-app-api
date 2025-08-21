import { internalServerError, serverReturn } from "../helpers/index.js"
import { getUserBalanceSchema } from "../../schemas/index.js"

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
                user_id: userId,
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
            console.error("GetUserBalanceController error:", e)
            return internalServerError()
        }
    }
}
