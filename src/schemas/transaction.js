import { z } from "zod"
import validator from "validator"

export const createTransactionSchema = z.object({
    user_id: z
        .string({ required_error: "user_id required" })
        .trim()
        .uuid({ message: "user_id must be a valid UUID" }),
    name: z
        .string({ required_error: "name required" })
        .trim()
        .min(1, { message: "name is required" }),
    date: z
        .string({ required_error: "date required" })
        .date({ message: "date must be in a valid date format ISOString" }),
    type: z.enum(["EXPENSE", "EARNING", "INVESTMENT"], {
        errorMap: () => ({
            message: "Type must be EXPENSE, EARNING or INVESTMENT",
        }),
    }),
    amount: z
        .number({
            required_error: "amount required",
            invalid_type_error: "amount must be a number",
        })
        .min(1, {
            message: "Amount must be greater than 0",
        })
        .refine((value) =>
            validator.isCurrency(value.toFixed(2), {
                digits_after_decimal: [2],
                allow_negatives: false,
                decimal_separator: ".",
            }),
        ),
})
