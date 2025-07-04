import { createTransactionSchema } from "../../schemas/index.js"
import { internalServerError, serverReturn } from "../helpers/index.js"
import { ZodError } from "zod"
export class CreateTransactionController {
    constructor(createTransactionUseCase) {
        this.createTransactionUseCase = createTransactionUseCase
    }
    async execute(httpRequest) {
        try {
            const params = httpRequest.body

            await createTransactionSchema.parseAsync(params)

            const createdTransaction =
                await this.createTransactionUseCase.execute(params)

            return serverReturn(200, createdTransaction)
        } catch (e) {
            if (e instanceof ZodError) {
                return serverReturn(400, { message: e.errors[0].message })
            }
            console.error(e)
            return internalServerError()
        }
    }
}
