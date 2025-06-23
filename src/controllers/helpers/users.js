import validator from "validator"
import { serverReturn } from "./http.js"

export const invalidPasswordResponse = () =>
    serverReturn(400, "Password must be at least 6 characters")

export const emailAlreadyInUseResponse = () =>
    serverReturn(400, "E-mail already in use")

export const invalidEmailResponse = () => serverReturn(400, "Invalid e-mail")

export const invalidIdResponse = () =>
    serverReturn(400, "Id must be provided and must be an UUID")

export const isPasswordValid = (password) => password.length >= 6

export const isEmailValid = (email) => validator.isEmail(email)

export const isIdValid = (userId) => userId && validator.isUUID(userId)
