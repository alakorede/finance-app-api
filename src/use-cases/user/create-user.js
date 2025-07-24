import { PostgresGetUserByEmailRepository } from "../../repositories/postgres/user/get-user-by-email.js"
import { EmailAlreadyInUseError } from "../../errors/user.js"

export class CreateUserUseCase {
    constructor(
        createUserRepository,
        passwordHasherAdapter,
        idGeneratorAdapter,
    ) {
        this.createUserRepository = createUserRepository
        this.passwordHasherAdapter = passwordHasherAdapter
        this.idGeneratorAdapter = idGeneratorAdapter
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

        const userId = this.idGeneratorAdapter.execute()
        const hashedPassword = await this.passwordHasherAdapter.hash(
            createUserParams.password,
        )
        const user = {
            ...createUserParams,
            id: userId,
            password: hashedPassword,
        }

        return await this.createUserRepository.execute(user)
    }
}
