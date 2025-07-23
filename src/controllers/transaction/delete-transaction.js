import { isIdValid, invalidIdResponse, serverReturn } from "../helpers/index.js"
import { TransactionNotFoundError } from "../../errors/transaction.js"

export class DeleteTransactionController {
    constructor(deleteTransactionUseCase) {
        this.deleteTransactionUseCase = deleteTransactionUseCase
    }
    async execute(httpRequest) {
        try {
            const transactionId = httpRequest.params.transactionId

            if (!isIdValid(transactionId)) {
                return invalidIdResponse()
            }

            const deletedTransaction =
                await this.deleteTransactionUseCase.execute(transactionId)

            if (!deletedTransaction) {
                throw new TransactionNotFoundError()
            }

            return serverReturn(200, deletedTransaction)
        } catch (e) {
            if (e instanceof TransactionNotFoundError) {
                return serverReturn(404, { message: e.message })
            }
            return serverReturn(500, { message: "Internal Server Error" })
        }
    }
}
