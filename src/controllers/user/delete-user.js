import {
    internalServerError,
    serverReturn,
    isIdValid,
    invalidIdResponse,
} from "../helpers/index.js"

import { UserNotFoundError } from "../../errors/user.js"

export class DeleteUserController {
    constructor(deleteUserUseCase) {
        this.deleteUserUseCase = deleteUserUseCase
    }
    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId

            if (!isIdValid(userId)) {
                return invalidIdResponse()
            }

            const deletedUser = await this.deleteUserUseCase.execute(userId)

            if (!deletedUser) {
                throw new UserNotFoundError()
            }

            return serverReturn(200, deletedUser)
        } catch (e) {
            if (e instanceof UserNotFoundError) {
                console.log(e)
                return serverReturn(404, { message: e.message })
            }

            console.log(e)
            return internalServerError()
        }
    }
}
