import {
    isIdValid,
    invalidIdResponse,
    internalServerError,
    serverReturn,
} from "../helpers/index.js"

export class GetUserBalanceController {
    constructor(getUserBalanceUseCase) {
        this.getUserBalanceUseCase = getUserBalanceUseCase
    }
    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId

            if (!isIdValid(userId)) {
                return invalidIdResponse()
            }

            const userBalanceInfo =
                await this.getUserBalanceUseCase.execute(userId)

            return serverReturn(200, userBalanceInfo)
        } catch (error) {
            console.error(error)
            return internalServerError()
        }
    }
}
