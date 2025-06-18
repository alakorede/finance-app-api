import { GetUserByIdUseCase } from "../use-cases/get-user-by-id.js"
import { serverReturn, internalServerError } from "./helpers/http.js"
import { invalidIdResponse, idIdValid } from "./helpers/users.js"

export class GetUserByIdController {
    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId

            if (!idIdValid(userId)) {
                return invalidIdResponse()
            }

            const getUserByIdUseCase = new GetUserByIdUseCase()
            const userFound = await getUserByIdUseCase.execute(userId)
            console.log(userFound)

            return !userFound
                ? serverReturn(400, { message: "user not found" })
                : serverReturn(200, userFound)
        } catch (e) {
            console.log(e)
            return internalServerError()
        }
    }
}
