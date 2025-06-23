import {
    isIdValid,
    invalidIdResponse,
    serverReturn,
    isAmountValid,
    isTypeValid,
    internalServerError,
} from "../helpers/index.js"
export class UpdateTransactionController {
    constructor(updateTransactionUseCase) {
        this.updateTransactionUseCase = updateTransactionUseCase
    }
    async execute(httpRequest) {
        try {
            const transactionId = httpRequest.params.transactionId
            const updateTransactionParams = httpRequest.body

            if (!isIdValid(transactionId)) {
                return invalidIdResponse()
            }

            if (Object.keys(updateTransactionParams).length === 0) {
                return serverReturn(400, {
                    message: "Transaction body is empty",
                })
            }

            const allowedFields = ["name", "date", "amount", "type"]

            const onlyAllowedFieldsWhereProvided = Object.keys(
                updateTransactionParams,
            ).some((field) => !allowedFields.includes(field))

            if (onlyAllowedFieldsWhereProvided) {
                return serverReturn(400, {
                    message: "Some provided field is not allowed",
                })
            }

            for (const [key, value] of Object.entries(
                updateTransactionParams,
            )) {
                if (typeof value === "string" && value.trim().length === 0) {
                    return serverReturn(400, {
                        message: `Field "${key}" is empty. Empty fields are not allowed.`,
                    })
                }
            }

            if (updateTransactionParams.amount) {
                if (updateTransactionParams.amount <= 0) {
                    return serverReturn(400, {
                        message: `Amount must be greater than 0`,
                    })
                }

                if (!isAmountValid(updateTransactionParams.amount)) {
                    return serverReturn(400, {
                        message: `Amount must be in Currency Format`,
                    })
                }
            }

            if (updateTransactionParams.type) {
                updateTransactionParams.type = updateTransactionParams.type
                    .trim()
                    .toUpperCase()

                if (!isTypeValid(updateTransactionParams.type)) {
                    return serverReturn(400, {
                        message:
                            "The type must be EARNING, EXPENSE or INVESTMENT",
                    })
                }
            }

            const transactionUpdated =
                await this.updateTransactionUseCase.execute(
                    transactionId,
                    updateTransactionParams,
                )

            return serverReturn(201, transactionUpdated)
        } catch (e) {
            console.log(e)
            return internalServerError()
        }
    }
}
