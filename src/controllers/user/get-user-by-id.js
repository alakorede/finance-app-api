import { serverReturn, internalServerError } from "../helpers/http.js"
import { invalidIdResponse, isIdValid } from "../helpers/users.js"
import { UserNotFoundError } from "../../errors/user.js"
export class GetUserByIdController {
    constructor(getUserByIdUseCase) {
        this.getUserByIdUseCase = getUserByIdUseCase
    }
    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId

            if (!isIdValid(userId)) {
                return invalidIdResponse()
            }

            const userFound = await this.getUserByIdUseCase.execute(userId)

            if (!userFound) {
                throw new UserNotFoundError()
            }

            return serverReturn(200, userFound)
        } catch (e) {
            if (e instanceof UserNotFoundError) {
                return serverReturn(400, { message: e.message })
            }
            console.log(e)
            return internalServerError()
        }
    }
}
