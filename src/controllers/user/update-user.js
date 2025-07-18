import { ZodError } from "zod"
import { updateUserSchema } from "../../schemas/index.js"
import {
    invalidIdResponse,
    isIdValid,
    serverReturn,
    internalServerError,
} from "../helpers/index.js"
import { EmailAlreadyInUseError, UserNotFoundError } from "../../errors/user.js"

export class UpdateUserController {
    constructor(updateUserUseCase) {
        this.updateUserUseCase = updateUserUseCase
    }
    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId

            if (!isIdValid(userId)) {
                return invalidIdResponse()
            }

            const updateUserParams = httpRequest.body

            await updateUserSchema.parseAsync(updateUserParams)

            const updatedUser = await this.updateUserUseCase.execute(
                userId,
                updateUserParams,
            )

            if (!updatedUser) {
                throw new UserNotFoundError()
            }

            return serverReturn(200, updatedUser)
        } catch (e) {
            if (e instanceof ZodError) {
                return serverReturn(400, { message: e.errors[0].message })
            }

            if (e instanceof EmailAlreadyInUseError) {
                return serverReturn(400, { message: e.message })
            }

            if (e instanceof UserNotFoundError) {
                return serverReturn(404, { message: e.message })
            }

            console.log(e)
            return internalServerError()
        }
    }
}
