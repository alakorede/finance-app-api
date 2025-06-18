import { serverReturn, internalServerError } from "./helpers/http.js"
import { invalidIdResponse, idIdValid } from "./helpers/users.js"

export class GetUserByIdController {
    constructor(getUserByIdUseCase) {
        this.getUserByIdUseCase = getUserByIdUseCase
    }
    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId

            if (!idIdValid(userId)) {
                return invalidIdResponse()
            }

            const userFound = await this.getUserByIdUseCase.execute(userId)

            return !userFound
                ? serverReturn(400, { message: "user not found" })
                : serverReturn(200, userFound)
        } catch (e) {
            console.log(e)
            return internalServerError()
        }
    }
}
