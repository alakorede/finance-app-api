export const serverReturn = (statusCode, body) => {
    return {
        statusCode,
        body,
    }
}

export const internalServerError = () =>
    serverReturn(500, { message: "Internal Server Error" })
