import { prisma } from "../../../../prisma/prisma.js"

export class PostgresGetUserBalanceRepository {
    async execute(userId) {
        //Prisma n suporta view, então precisei criar uma query direto mesmo, tem usar a estrutura do prisma pra fazer a consulta
        return await prisma.$queryRaw`
        SELECT * FROM user_balance_view WHERE user_id = ${userId}
      `
    }
}
