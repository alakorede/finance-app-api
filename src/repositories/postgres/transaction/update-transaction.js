import { prisma } from "../../../../prisma/prisma.js"
export class PostgresUpdateTransactionRepository {
    async execute(transactionId, updateTransactionParams) {
        try {
            return await prisma.transaction.update({
                where: {
                    id: transactionId,
                },
                data: updateTransactionParams,
            })
        } catch (e) {
            console.error(e)
            return null
        }
    }
}
