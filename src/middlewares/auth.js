import jwt from "jsonwebtoken"

export const auth = (req, res, next) => {
    try {
        //pegar access token no header
        const accessToken = req.headers?.authorization?.split("Bearer ")[1]

        if (!accessToken) {
            return res.status(401).send({ message: "Unauthorized" })
        }

        const isValidToken = jwt.verify(
            accessToken,
            process.env.JWT_ACCESS_TOKEN_SECRET,
        )

        if (!isValidToken) {
            return res.status(401).send({ message: "Unauthorized" })
        }
        req.userId = isValidToken.userId

        next()
    } catch (e) {
        console.error(e)
        return res.status(401).send({ message: "Unauthorized" })
    }
}
