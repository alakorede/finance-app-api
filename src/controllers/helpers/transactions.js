import validator from "validator"

export const isAmountValid = (amount) => {
    return validator.isCurrency(amount.toString(), {
        digits_after_decimal: [2],
        allow_negatives: false,
        decimal_separator: ".",
    })
}

export const isTypeValid = (type) => {
    return ["EARNING", "EXPENSE", "INVESTMENT"].includes(type)
}
