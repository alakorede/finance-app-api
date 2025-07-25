import validator from "validator"
import { serverReturn } from "./http.js"

export const emailAlreadyInUseResponse = () =>
    serverReturn(400, { message: "E-mail already in use" })

export const invalidIdResponse = () =>
    serverReturn(400, { message: "Id must be provided and must be an UUID" })

export const isIdValid = (userId) => userId && validator.isUUID(userId)
