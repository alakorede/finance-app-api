import { EmailAlreadyInUseError } from "../../errors/user.js"
import { serverReturn, internalServerError } from "../helpers/http.js"
import {
    invalidPasswordResponse,
    emailAlreadyInUseResponse,
    invalidEmailResponse,
    isPasswordValid,
    isEmailValid,
} from "../helpers/users.js"

import { validateRequiredFields } from "../helpers/validation.js"

export class CreateUserController {
    constructor(createUserUseCase) {
        this.createUserUseCase = createUserUseCase
    }
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

            const areRequiredFieldsValid = validateRequiredFields(
                params,
                requiredFields,
            )

            if (!areRequiredFieldsValid.ok) {
                return serverReturn(400, {
                    message: `Missing param: ${areRequiredFieldsValid.missingField}`,
                })
            }
            if (!isPasswordValid(params.password)) {
                return invalidPasswordResponse()
            }

            if (!isEmailValid(params.email)) {
                return invalidEmailResponse()
            }

            const createdUser = await this.createUserUseCase.execute(params)

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
