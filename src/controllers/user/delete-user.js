import {
    internalServerError,
    serverReturn,
    isIdValid,
    invalidIdResponse,
} from "../helpers/index.js"

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

            return serverReturn(200, deletedUser)
        } catch (e) {
            console.log(e)
            return internalServerError()
        }
    }
}
