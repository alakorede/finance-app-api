import { prisma } from "../../../../prisma/prisma.js"
export class PostgresGetUserByIdRepository {
    async execute(id) {
        return await prisma.user.findUnique({
            where: {
                id,
            },
        })
    }
}
