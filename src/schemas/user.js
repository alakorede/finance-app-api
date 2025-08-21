import { z } from "zod"

export const createUserSchema = z.object({
    first_name: z
        .string({
            required_error: "first_name required",
        })
        .trim()
        .min(1, {
            message: "first_name required",
        }),
    last_name: z
        .string({
            required_error: "last_name required",
        })
        .trim()
        .min(1, {
            message: "last_name required",
        }),
    email: z
        .string({
            required_error: "E-mail required",
        })
        .email({
            message: "Provide a valid e-mail",
        }),
    password: z
        .string({
            required_error: "Password required",
        })
        .trim()
        .min(6, {
            message: "Password must have at least 6 characters",
        }),
})

export const updateUserSchema = createUserSchema.partial().strict()

export const loginSchema = z.object({
    email: z
        .string({
            required_error: "E-mail required",
        })
        .email({
            message: "Provide a valid e-mail",
        }),
    password: z
        .string({
            required_error: "Password required",
        })
        .trim()
        .min(6, {
            message: "Password must have at least 6 characters",
        }),
})

export const refreshTokenSchema = z.object({
    refreshToken: z
        .string({
            required_error: "Refresh token is required.",
            invalid_type_error: "Provide a valid refresh token format.",
        })
        .trim()
        .min(1, {
            message: "Refresh token is required",
        }),
})

export const getUserBalanceSchema = z.object({
    user_id: z
        .string({ required_error: "Id must be provided and must be an UUID" })
        .trim()
        .uuid({ message: "Id must be provided and must be an UUID" }),
    from: z.string({ required_error: "date 'from' is required" }).date(),
    to: z.string({ required_error: "date 'to' is required" }).date(),
})
