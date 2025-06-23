import {
    serverReturn,
    internalServerError,
    isIdValid,
    invalidIdResponse,
} from "../helpers/index.js"

import { UserNotFoundError } from "../../errors/user.js"

export class GetTransactionsByUserIdController {
    constructor(getTransactionsByUserIdUseCase) {
        this.getTransactionsByUserIdUseCase = getTransactionsByUserIdUseCase
    }
    async execute(httpRequest) {
        try {
            const userId = httpRequest.query.userId

            if (!isIdValid(userId)) {
                return invalidIdResponse()
            }

            const transactions =
                await this.getTransactionsByUserIdUseCase.execute(userId)

            return serverReturn(201, transactions)
        } catch (e) {
            if (e instanceof UserNotFoundError) {
                return serverReturn(400, { message: e.message })
            }
            console.error(e)
            return internalServerError()
        }
    }
}
