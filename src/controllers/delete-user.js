import { internalServerError, serverReturn } from "./helpers/http.js"
import { idIdValid, invalidIdResponse } from "./helpers/users.js"
import { DeleteUserUseCase } from "../use-cases/delete-user.js"

export class DeleteUserController {
    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId

            if (!idIdValid(userId)) {
                return invalidIdResponse()
            }

            const deleteUserUseCase = new DeleteUserUseCase()

            const deletedUser = await deleteUserUseCase.execute(userId)

            return serverReturn(201, deletedUser)
        } catch (e) {
            console.log(e)
            return internalServerError()
        }
    }
}
