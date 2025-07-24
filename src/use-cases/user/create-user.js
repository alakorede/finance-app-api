import { v4 as uuidv4 } from "uuid"
import { PostgresGetUserByEmailRepository } from "../../repositories/postgres/user/get-user-by-email.js"
import { EmailAlreadyInUseError } from "../../errors/user.js"

export class CreateUserUseCase {
    constructor(createUserRepository, bcryptAdapter) {
        this.createUserRepository = createUserRepository
        this.bcryptAdapter = bcryptAdapter
    }
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
        const hashedPassword = await this.bcryptAdapter.hash(
            createUserParams.password,
            10,
        )
        const user = {
            ...createUserParams,
            id: userId,
            password: hashedPassword,
        }

        return await this.createUserRepository.execute(user)
    }
}
