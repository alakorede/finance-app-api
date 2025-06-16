import { GetUserByIdUseCase } from "../use-cases/get-user-by-id.js"
import { serverReturn } from "./helpers.js"
import validator from "validator"

export class GetUserByIdController {
    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId

            if (!userId || !validator.isUUID(userId)) {
                return serverReturn(400, {
                    message: "userId must be provided and must be an UUID",
                })
            }

            const getUserByIdUseCase = new GetUserByIdUseCase()
            const userFound = await getUserByIdUseCase.execute(userId)
            console.log(userFound)

            return !userFound
                ? serverReturn(200, { message: "user not found" })
                : serverReturn(200, userFound)
        } catch (e) {
            console.log(e)
            return serverReturn(500, { message: "Internal server error" })
        }
    }
}
