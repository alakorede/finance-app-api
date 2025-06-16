import bcrypt from "bcrypt"
import { v4 as uuidv4 } from "uuid"
import { PostgresCreateUserRepository } from "../repositories/create-user"

export class CreateUserUseCase {
    async execute(createUserParams) {
        // Falta: verificar se o e-mail está em uso

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
