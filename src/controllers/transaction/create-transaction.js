import validator from "validator"
import { internalServerError, serverReturn } from "../helpers/http.js"
import { isIdValid, invalidIdResponse } from "../helpers/users.js"

export class CreateTransactionController {
    constructor(createTransactionUseCase) {
        this.createTransactionUseCase = createTransactionUseCase
    }
    async execute(httpRequest) {
        try {
            const params = httpRequest.body
            const requiredFields = ["user_id", "name", "date", "amount", "type"]

            for (const field of requiredFields) {
                if (!params[field] || params[field].trim().length === 0) {
                    return serverReturn(400, {
                        message: `Missing param: ${field}`,
                    })
                }
            }

            if (!isIdValid(params.user_id)) {
                return invalidIdResponse
            }

            if (params.amount <= 0) {
                return serverReturn(400, {
                    message: `Amount must be greater than 0`,
                })
            }

            const amountIsValid = validator.isCurrency(
                params.amount.toString(),
                {
                    digits_after_decimal: [2],
                    allow_negatives: false,
                    decimal_separator: ".",
                },
            )

            if (!amountIsValid) {
                return serverReturn(400, {
                    message: `Amount must be in Currency Format`,
                })
            }

            params.type = params.type.trim().toUpperCase()

            const typeIsValid = ["EARNING", "EXPENSE", "INVESTMENT"].includes(
                params.type,
            )

            if (!typeIsValid) {
                return serverReturn(400, {
                    message: "The type must be EARNING, EXPENSE or INVESTMENT",
                })
            }

            const createdTransaction =
                await this.createTransactionUseCase.execute(params)

            return serverReturn(201, createdTransaction)
        } catch (e) {
            console.error(e)
            return internalServerError()
        }
    }
}
