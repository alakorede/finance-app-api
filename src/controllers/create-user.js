import validator from "validator"
import { CreateUserUseCase } from "../use-cases/create-user.js"
import { serverReturn } from "./helpers.js"

export class CreateUserController {
    async execute(httpRequest) {
        try {
            //validar a requisição (campos obrigatórios, e-mail válido e tamanho de senha)
            const params = httpRequest.body
            const requiredFields = [
                "first_name",
                "last_name",
                "email",
                "password",
            ]

            for (const field of requiredFields) {
                if (!params[field] || params[field].trim().length === 0) {
                    return serverReturn(400, {
                        message: `Missing param: ${field}`,
                    })
                }
            }

            if (params.password.length < 6) {
                return serverReturn(400, {
                    message: "Password must be at least 6 characters",
                })
            }

            if (!validator.isEmail(params.email)) {
                return serverReturn(400, { message: "Invalid e-mail" })
            }
            //chamar o use case
            const createUserUseCase = new CreateUserUseCase()

            const createdUser = await createUserUseCase.execute(params)
            // retornar a resposta para o usuário (status code)

            return serverReturn(201, createdUser)
        } catch (e) {
            console.log(e)
            return serverReturn(500, { message: "Internal server error" })
        }
    }
}
