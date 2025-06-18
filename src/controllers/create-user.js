import { CreateUserUseCase } from "../use-cases/create-user.js"
import { EmailAlreadyInUseError } from "../errors/user.js"
import { serverReturn, internalServerError } from "./helpers/http.js"
import {
    invalidPasswordResponse,
    emailAlreadyInUseResponse,
    invalidEmailResponse,
    isPasswordValid,
    isEmailValid,
} from "./helpers/users.js"

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

            if (!isPasswordValid(params.password)) {
                return invalidPasswordResponse()
            }

            if (!isEmailValid(params.email)) {
                return invalidEmailResponse()
            }
            //chamar o use case
            const createUserUseCase = new CreateUserUseCase()

            const createdUser = await createUserUseCase.execute(params)
            // retornar a resposta para o usuário (status code)

            return serverReturn(201, createdUser)
        } catch (e) {
            if (e instanceof EmailAlreadyInUseError) {
                return emailAlreadyInUseResponse()
            }

            console.log(e)
            return internalServerError()
        }
    }
}
