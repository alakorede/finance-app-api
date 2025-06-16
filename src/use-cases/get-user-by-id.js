import { PostgresGetUserByIdRepository } from "../repositories/postgres/get-user-by-id.js"

export class GetUserByIdUseCase {
    async execute(userId) {
        const getUserByIdRepository = new PostgresGetUserByIdRepository()

        return await getUserByIdRepository.execute(userId)
    }
}
