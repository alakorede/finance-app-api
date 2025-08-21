import { serverReturn, internalServerError } from "../helpers/index.js"

import { UserNotFoundError } from "../../errors/user.js"
import { getTransactionsByUserIdSchema } from "../../schemas/transaction.js"
import { ZodError } from "zod"

export class GetTransactionsByUserIdController {
    constructor(getTransactionsByUserIdUseCase) {
        this.getTransactionsByUserIdUseCase = getTransactionsByUserIdUseCase
    }
    async execute(httpRequest) {
        try {
            const userId = httpRequest.query.userId
            const from = httpRequest.query.from
            const to = httpRequest.query.to

            await getTransactionsByUserIdSchema.parseAsync({
                user_id: userId,
                from,
                to,
            })

            const transactions =
                await this.getTransactionsByUserIdUseCase.execute(userId)

            return serverReturn(200, transactions)
        } catch (e) {
            if (e instanceof ZodError) {
                console.error({ message: e.errors[0].message })
                return serverReturn(400, { message: e.errors[0].message })
            }

            if (e instanceof UserNotFoundError) {
                return serverReturn(404, { message: e.message })
            }

            console.error("GetTransactionsByUserIdController error:", e)
            return internalServerError()
        }
    }
}
