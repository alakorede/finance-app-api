import {
    invalidIdResponse,
    isIdValid,
    serverReturn,
    internalServerError,
} from "../helpers/index.js"
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
                return serverReturn(404, { message: e.message })
            }
            return internalServerError()
        }
    }
}
