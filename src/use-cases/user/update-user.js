import { EmailAlreadyInUseError } from "../../errors/user.js"
import { PostgresGetUserByEmailRepository } from "../../repositories/postgres/user/get-user-by-email.js"

export class UpdateUserUseCase {
    constructor(updateUserRepository, passwordHasherAdapter) {
        this.updateUserRepository = updateUserRepository
        this.passwordHasherAdapter = passwordHasherAdapter
    }
    async execute(userId, updateUserParams) {
        if (updateUserParams.email) {
            const postgresGetUserByEmailRepository =
                new PostgresGetUserByEmailRepository()

            const userAlreadyExists =
                await postgresGetUserByEmailRepository.execute(
                    updateUserParams.email,
                )

            if (userAlreadyExists && userAlreadyExists.id !== userId) {
                throw new EmailAlreadyInUseError()
            }
        }

        if (updateUserParams.password) {
            updateUserParams.password = await this.passwordHasherAdapter.hash(
                updateUserParams.password,
            )
        }

        const updatedUser = await this.updateUserRepository.execute(
            userId,
            updateUserParams,
        )

        return updatedUser
    }
}
