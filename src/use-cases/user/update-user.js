import { EmailAlreadyInUseError } from "../../errors/user.js"

export class UpdateUserUseCase {
    constructor(
        updateUserRepository,
        getUserByEmailRepository,
        passwordHasherAdapter,
    ) {
        this.getUserByEmailRepository = getUserByEmailRepository
        this.updateUserRepository = updateUserRepository
        this.passwordHasherAdapter = passwordHasherAdapter
    }
    async execute(userId, updateUserParams) {
        if (updateUserParams.email) {
            const userAlreadyExists =
                await this.getUserByEmailRepository.execute(
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
