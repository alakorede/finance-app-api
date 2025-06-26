import { prisma } from "../../../../prisma/prisma.js"
export class PostgresDeleteUserRepository {
    async execute(userId) {
        try {
            return await prisma.user.delete({
                where: {
                    id: userId,
                },
            })
        } catch (e) {
            console.log(e)
            return null
        }
    }
}
