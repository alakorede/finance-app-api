import { prisma } from "../../../../prisma/prisma.js"
export class PostgresUpdateUserRepository {
    async execute(userId, updateUserParams) {
        const userExists = await prisma.user.findUnique({
            where: { id: userId },
        })

        if (!userExists) {
            return null
        }

        return await prisma.user.update({
            where: { id: userId },
            data: updateUserParams,
        })
    }
}
