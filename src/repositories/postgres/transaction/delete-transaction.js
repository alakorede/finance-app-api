import { prisma } from "../../../../prisma/prisma.js"
export class PostgresDeleteTransactionRepository {
    async execute(transactionId) {
        try {
            return await prisma.transaction.delete({
                where: {
                    id: transactionId,
                },
            })
        } catch (e) {
            console.log(e)
            return null
        }
    }
}
