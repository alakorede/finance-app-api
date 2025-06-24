import { updateTransactionSchema } from "../../schemas/index.js"
import { ZodError } from "zod"
import {
    isIdValid,
    invalidIdResponse,
    serverReturn,
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

            await updateTransactionSchema.parseAsync(updateTransactionParams)

            const transactionUpdated =
                await this.updateTransactionUseCase.execute(
                    transactionId,
                    updateTransactionParams,
                )

            return serverReturn(200, transactionUpdated)
        } catch (e) {
            if (e instanceof ZodError) {
                return serverReturn(400, { message: e.errors[0].message })
            }
            console.log(e)
            return internalServerError()
        }
    }
}
