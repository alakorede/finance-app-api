import { PostgresDeleteUserRepository } from "../repositories/postgres/delete-user.js"

export class DeleteUserUseCase {
    async execute(userId) {
        const deleteUserReporisoty = new PostgresDeleteUserRepository()

        const deletedUser = await deleteUserReporisoty.execute(userId)

        return deletedUser
    }
}
