import { PostgresGetUserByIdRepository } from "../repositories/postgres/get-user-by-id.js"

export class GetUserByIdUseCate {
    async execute(userId) {
        const getUserByIdRepository = new PostgresGetUserByIdRepository()

        return await getUserByIdRepository.execute(userId)
    }
}
