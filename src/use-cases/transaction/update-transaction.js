import { ForbiddenError } from "../../errors/user.js"
export class UpdateTransactionUseCase {
    constructor(updateTransactionRepository, getTransactionByIdRepository) {
        this.updateTransactionRepository = updateTransactionRepository
        this.getTransactionByIdRepository = getTransactionByIdRepository
    }
    async execute(userId, transactionId, updateTransactionParams) {
        const transaction =
            await this.getTransactionByIdRepository.execute(transactionId)
        if (transaction.user_id != userId) {
            throw new ForbiddenError()
        }
        return await this.updateTransactionRepository.execute(
            transactionId,
            updateTransactionParams,
        )
    }
}
