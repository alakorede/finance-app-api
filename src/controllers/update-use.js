import validator from "validator"
import { UpdateUserUseCase } from "../use-cases/update-user.js"
import { serverReturn } from "./helpers.js"
import { EmailAlreadyInUseError } from "../errors/user.js"

export class UpdateUserController {
    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId

            if (!userId || !validator.isUUID(userId)) {
                return serverReturn(400, {
                    message: "userId must be provided and must be an UUID",
                })
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
                if (updateUserParams.password.length < 6) {
                    return serverReturn(400, {
                        message: "Password must be at least 6 characters",
                    })
                }
            }

            if (updateUserParams.email) {
                if (!validator.isEmail(updateUserParams.email)) {
                    return serverReturn(400, { message: "Invalid e-mail" })
                }
            }

            const updateUserUseCase = new UpdateUserUseCase()

            const updatedUser = await updateUserUseCase.execute(
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
            return serverReturn(500, { message: "Internal server error" })
        }
    }
}
