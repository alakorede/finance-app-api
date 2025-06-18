import { internalServerError, serverReturn } from "./helpers/http.js"
import { idIdValid, invalidIdResponse } from "./helpers/users.js"

export class DeleteUserController {
    constructor(deleteUserUseCase) {
        this.deleteUserUseCase = deleteUserUseCase
    }
    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId

            if (!idIdValid(userId)) {
                return invalidIdResponse()
            }

            const deletedUser = await this.deleteUserUseCase.execute(userId)

            return serverReturn(201, deletedUser)
        } catch (e) {
            console.log(e)
            return internalServerError()
        }
    }
}
