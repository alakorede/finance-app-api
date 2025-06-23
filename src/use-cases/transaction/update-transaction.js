export class UpdateTransactionUseCase {
    constructor(updateTransactionRepository, getUserByIdRepository) {
        this.updateTransactionRepository = updateTransactionRepository
        this.getUserByIdRepository = getUserByIdRepository
    }
    async execute(transactionId, updateTransactionParams) {
        return await this.updateTransactionRepository.execute(
            transactionId,
            updateTransactionParams,
        )
    }
}
