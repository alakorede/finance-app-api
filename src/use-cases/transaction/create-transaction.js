import { UserNotFoundError } from "../../errors/user.js"

export class CreateTransactionUseCase {
    constructor(
        createTransactionRepository,
        getUserByIdRepository,
        idGeneratorAdapter,
    ) {
        this.createTransactionRepository = createTransactionRepository
        this.getUserByIdRepository = getUserByIdRepository
        this.idGeneratorAdapter = idGeneratorAdapter
    }
    async execute(createTransactionParams) {
        const user = await this.getUserByIdRepository.execute(
            createTransactionParams.user_id,
        )
        if (!user) {
            throw new UserNotFoundError()
        }

        const transactionId = this.idGeneratorAdapter.execute()

        const createdTransaction =
            await this.createTransactionRepository.execute({
                ...createTransactionParams,
                id: transactionId,
            })
        return createdTransaction
    }
}
