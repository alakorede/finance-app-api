import bcrypt from "bcrypt"
import { EmailAlreadyInUseError } from "../errors/user.js"
import { PostgresGetUserByEmailRepository } from "../repositories/postgres/get-user-by-email.js"

export class UpdateUserUseCase {
    constructor(updateUserRepository) {
        this.updateUserRepository = updateUserRepository
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
            updateUserParams.password = await bcrypt.hash(
                updateUserParams.password,
                10,
            )
        }

        const updatedUser = await this.updateUserRepository.execute(
            userId,
            updateUserParams,
        )

        return updatedUser
    }
}
