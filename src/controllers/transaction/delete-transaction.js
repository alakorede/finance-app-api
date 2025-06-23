import { isIdValid, invalidIdResponse, serverReturn } from "../helpers"

export class DeleteTransactionController {
    constructor(deleteTransactionUseCase) {
        this.deleteTransactionUseCase = deleteTransactionUseCase
    }
    async execute(httpRequest) {
        const transactionId = httpRequest.params.transactionId

        if (!isIdValid(transactionId)) {
            return invalidIdResponse()
        }

        const deletedTransaction =
            await this.deleteTransactionUseCase.execute(transactionId)

        return serverReturn(201, deletedTransaction)
    }
}
