import { UserNotFoundError } from "../../errors/user.js"

export class GetUserBalanceUseCase {
    constructor(getUserBalanceRepository, getUserByIdRepository) {
        this.getUserBalanceRepository = getUserBalanceRepository
        this.getUserByIdRepository = getUserByIdRepository
    }
    async execute(userId, from, to) {
        const userExists = await this.getUserByIdRepository.execute(userId)
        if (!userExists) {
            throw new UserNotFoundError()
        }
        return await this.getUserBalanceRepository.execute(userId, from, to)
    }
}
