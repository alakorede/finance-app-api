export class UpdateTransactionUseCase {
    constructor(updateTransactionRepository) {
        this.updateTransactionRepository = updateTransactionRepository
    }
    async execute(transactionId, updateTransactionParams) {
        return await this.updateTransactionRepository.execute(
            transactionId,
            updateTransactionParams,
        )
    }
}
