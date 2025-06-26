import { prisma } from "../../../../prisma/prisma.js"

export class PostgresGetUserBalanceRepository {
    async execute(userId) {
        //Prisma n suporta view, então precisei criar uma query direto mesmo, tem usar a estrutura do prisma pra fazer a consulta
        return await prisma.$queryRaw`
        SELECT * FROM user_balance_view WHERE user_id = ${userId}
      `

        //Se eu não tivesse a view, usaria o o agregate pra fazer essa consulta, segue exemplo:
        // const {_sum: {amount: totalExpenses}} = await prisma.transaction.aggregate({
        //     where: {
        //         user_id: userId,
        //         type: "EXPENSE",
        //     },
        //     _sum: {
        //         amount: true,
        //     },
        // })
        // const {_sum: {amount: totalEarnings}} = await prisma.transaction.aggregate({
        //     where: {
        //         user_id: userId,
        //         type: "EARNING",
        //     },
        //     _sum: {
        //         amount: true,
        //     },
        // })
        // const {_sum: {amount: totalInvestments}} = await prisma.transaction.aggregate({
        //     where: {
        //         user_id: userId,
        //         type: "INVESTMENT",
        //     },
        //     _sum: {
        //         amount: true,
        //     },
        // })
        // const balance = totalEarnings - totalExpenses - totalInvestments
    }
}
