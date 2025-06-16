import bcrypt from "bcrypt"
import { v4 as uuidv4 } from "uuid"
import { PostgresCreateUserRepository } from "../repositories/postgres/create-user.js"
import { PostgresGetUserByEmailRepository } from "../repositories/postgres/get-user-by-email.js"
import { EmailAlreadyInUseError } from "../errors/user.js"

export class CreateUserUseCase {
    async execute(createUserParams) {
        // Falta: verificar se o e-mail está em uso
        const postgresGetUserByEmailRepository =
            new PostgresGetUserByEmailRepository()

        const userAlreadyExists =
            await postgresGetUserByEmailRepository.execute(
                createUserParams.email,
            )

        if (userAlreadyExists) {
            throw new EmailAlreadyInUseError()
        }

        const userId = uuidv4()
        const hashedPassword = await bcrypt.hash(createUserParams.password, 10)
        const user = {
            ...createUserParams,
            id: userId,
            password: hashedPassword,
        }
        const postgresCreateUserRepository = new PostgresCreateUserRepository()

        return await postgresCreateUserRepository.execute(user)
    }
}
