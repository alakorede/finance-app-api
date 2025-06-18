import { serverReturn, internalServerError } from "../helpers/http.js"
import {
    invalidPasswordResponse,
    invalidEmailResponse,
    invalidIdResponse,
    isPasswordValid,
    isEmailValid,
    idIdValid,
} from "../helpers/users.js"
import { EmailAlreadyInUseError } from "../../errors/user.js"

export class UpdateUserController {
    constructor(updateUserUseCase) {
        this.updateUserUseCase = updateUserUseCase
    }
    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId

            if (!idIdValid(userId)) {
                return invalidIdResponse()
            }

            const updateUserParams = httpRequest.body

            const allowedFields = [
                "first_name",
                "last_name",
                "email",
                "password",
            ]

            const someFieldIsNotAllowed = Object.keys(updateUserParams).some(
                (field) => !allowedFields.includes(field),
            )

            if (someFieldIsNotAllowed) {
                return serverReturn(400, {
                    message: "Some provided field is not allowed",
                })
            }

            for (const [key, value] of Object.entries(updateUserParams)) {
                if (typeof value === "string" && value.trim().length === 0) {
                    return serverReturn(400, {
                        message: `Field "${key}" is empty. Empty fields are not allowed.`,
                    })
                }
            }

            if (updateUserParams.password) {
                if (!isPasswordValid(updateUserParams.password)) {
                    return invalidPasswordResponse()
                }
            }

            if (updateUserParams.email) {
                if (!isEmailValid(updateUserParams.email)) {
                    return invalidEmailResponse()
                }
            }

            const updatedUser = await this.updateUserUseCase.execute(
                userId,
                updateUserParams,
            )

            if (!updatedUser) {
                return serverReturn(400, { message: "Update user failed" })
            }

            return serverReturn(201, updatedUser)
        } catch (e) {
            if (e instanceof EmailAlreadyInUseError) {
                return serverReturn(400, { message: e.message })
            }

            console.log(e)
            return internalServerError()
        }
    }
}
