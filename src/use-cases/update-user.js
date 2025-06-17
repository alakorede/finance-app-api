import bcrypt from "bcrypt"
import { PostgresUpdateUserRepository } from "../repositories/postgres/update-user.js"
import { EmailAlreadyInUseError } from "../errors/users.js"
import { PostgresGetUserByEmailRepository } from "../repositories/postgres/get-user-by-email.js"

export class PostgresUpdateUserUseCase {
    async execute(userId, updateUserParams) {
        if (updateUserParams.email) {
            const postgresGetUserByEmailRepository =
                new PostgresGetUserByEmailRepository()

            const userAlreadyExists =
                await postgresGetUserByEmailRepository.execute(
                    updateUserParams.email,
                )

            if (userAlreadyExists) {
                throw new EmailAlreadyInUseError()
            }
        }

        if (updateUserParams.password) {
            updateUserParams.password = await bcrypt.hash(
                updateUserParams.password,
                10,
            )
        }

        const updatedUser = await PostgresUpdateUserRepository.execute(
            userId,
            updateUserParams,
        )

        return updatedUser
    }
}
