import {
    internalServerError,
    serverReturn,
    isIdValid,
    invalidIdResponse,
    validateRequiredFields,
    isAmountValid,
    isTypeValid,
} from "../helpers/index.js"

export class CreateTransactionController {
    constructor(createTransactionUseCase) {
        this.createTransactionUseCase = createTransactionUseCase
    }
    async execute(httpRequest) {
        try {
            const params = httpRequest.body
            const requiredFields = ["user_id", "name", "date", "amount", "type"]

            const areRequiredFieldsValid = validateRequiredFields(
                params,
                requiredFields,
            )

            if (!areRequiredFieldsValid.ok) {
                return serverReturn(400, {
                    message: `Missing param: ${areRequiredFieldsValid.missingField}`,
                })
            }

            if (!isIdValid(params.user_id)) {
                return invalidIdResponse
            }

            if (params.amount <= 0) {
                return serverReturn(400, {
                    message: `Amount must be greater than 0`,
                })
            }

            const amountIsValid = isAmountValid(params.amount)

            if (!amountIsValid) {
                return serverReturn(400, {
                    message: `Amount must be in Currency Format`,
                })
            }

            params.type = params.type.trim().toUpperCase()

            if (!isTypeValid(params.type)) {
                return serverReturn(400, {
                    message: "The type must be EARNING, EXPENSE or INVESTMENT",
                })
            }

            const createdTransaction =
                await this.createTransactionUseCase.execute(params)

            return serverReturn(200, createdTransaction)
        } catch (e) {
            console.error(e)
            return internalServerError()
        }
    }
}
