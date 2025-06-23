import { UserNotFoundError } from "../../errors/user.js"

export class UpdateTransactionUseCase {
    constructor(updateTransactionRepository, getUserByIdRepository) {
        this.updateTransactionRepository = updateTransactionRepository
        this.getUserByIdRepository = getUserByIdRepository
    }
    async execute(userId, updateTransactionParams) {
        const userExists = await this.getUserByIdRepository.execute(userId)
        if (!userExists) {
            throw new UserNotFoundError()
        }

        //const transactionExists = await this
        //Verificaria se a transaction existe na base

        return await this.updateTransactionRepository.execute(
            userId,
            updateTransactionParams,
        )
    }
}
