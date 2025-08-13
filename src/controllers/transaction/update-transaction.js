import { updateTransactionSchema } from "../../schemas/index.js"
import { TransactionNotFoundError } from "../../errors/transaction.js"
import { ForbiddenError } from "../../errors/user.js"
import { ZodError } from "zod"
import {
    isIdValid,
    invalidIdResponse,
    serverReturn,
    internalServerError,
} from "../helpers/index.js"
export class UpdateTransactionController {
    constructor(updateTransactionUseCase) {
        this.updateTransactionUseCase = updateTransactionUseCase
    }
    async execute(httpRequest) {
        try {
            const transactionId = httpRequest.params.transactionId
            const updateTransactionParams = httpRequest.body

            if (!isIdValid(transactionId)) {
                return invalidIdResponse()
            }

            await updateTransactionSchema.parseAsync(updateTransactionParams)

            const transactionUpdated =
                await this.updateTransactionUseCase.execute(
                    httpRequest.userId,
                    transactionId,
                    updateTransactionParams,
                )
            if (!transactionUpdated) {
                throw new TransactionNotFoundError()
            }
            return serverReturn(200, transactionUpdated)
        } catch (e) {
            if (e instanceof ZodError) {
                return serverReturn(400, { message: e.errors[0].message })
            }

            if (e instanceof TransactionNotFoundError) {
                return serverReturn(404, { message: e.message })
            }

            if (e instanceof ForbiddenError) {
                return serverReturn(403, { message: e.message })
            }

            return internalServerError()
        }
    }
}
