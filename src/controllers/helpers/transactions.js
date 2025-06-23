import validator from "validator"

export const isAmountValid = (amount) => {
    if (typeof amount !== "number") {
        return false
    }
    return validator.isCurrency(amount.toFixed(2), {
        digits_after_decimal: [2],
        allow_negatives: false,
        decimal_separator: ".",
    })
}

export const isTypeValid = (type) => {
    return ["EARNING", "EXPENSE", "INVESTMENT"].includes(type)
}
