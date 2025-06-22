import validator from "validator"

export const isString = (value) => typeof value === "string"

export const validateRequiredFields = (params, requiredFields) => {
    for (const field of requiredFields) {
        const fieldIsMissing = !params[field]
        const fieldIsEmpty =
            isString(params[field]) &&
            validator.isEmpty(params[field], { ignore_whitespace: true })

        if (fieldIsMissing || fieldIsEmpty) {
            return { ok: false, missingField: field }
        }
    }
    return { ok: true }
}
