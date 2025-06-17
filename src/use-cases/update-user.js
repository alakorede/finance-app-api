import bcrypt from "bcrypt"
import { PostgresUpdateUserRepository } from "../repositories/postgres/update-user.js"
import { EmailAlreadyInUseError } from "../errors/user.js"
import { PostgresGetUserByEmailRepository } from "../repositories/postgres/get-user-by-email.js"

export class UpdateUserUseCase {
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

        const postgresUpdateUserRepository = new PostgresUpdateUserRepository()

        const updatedUser = await postgresUpdateUserRepository.execute(
            userId,
            updateUserParams,
        )

        return updatedUser
    }
}
