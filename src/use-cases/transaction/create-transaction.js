import { v4 as uuidv4 } from "uuid"
import { UserNotFoundError } from "../../errors/user.js"

export class CreateTransactionUseCase {
    constructor(createTransactionRepository, getUserByIdRepository) {
        this.createTransactionRepository = createTransactionRepository
        this.getUserByIdRepository = getUserByIdRepository
    }
    async execute(createTransactionParams) {
        const user = await this.getUserByIdRepository.execute(
            createTransactionParams.userId,
        )
        if (!user) {
            throw new UserNotFoundError()
        }
        const transactionId = uuidv4()

        const createdTransaction =
            await this.createTransactionRepository.execute({
                ...createTransactionParams,
                id: transactionId,
            })
        return createdTransaction
    }
}
