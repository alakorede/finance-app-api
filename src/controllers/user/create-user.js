import { ZodError } from "zod"
import { EmailAlreadyInUseError } from "../../errors/user.js"
import { createUserSchema } from "../../schemas/index.js"

import {
    serverReturn,
    internalServerError,
    emailAlreadyInUseResponse,
} from "../helpers/index.js"

export class CreateUserController {
    constructor(createUserUseCase) {
        this.createUserUseCase = createUserUseCase
    }
    async execute(httpRequest) {
        try {
            //validar a requisição (campos obrigatórios, e-mail válido e tamanho de senha)
            const params = httpRequest.body

            await createUserSchema.parseAsync(params)

            const createdUser = await this.createUserUseCase.execute(params)

            return serverReturn(200, createdUser)
        } catch (e) {
            if (e instanceof ZodError) {
                console.log()
                return serverReturn(400, { message: e.errors[0].message })
            }

            if (e instanceof EmailAlreadyInUseError) {
                return emailAlreadyInUseResponse()
            }

            console.log(e)
            return internalServerError()
        }
    }
}
