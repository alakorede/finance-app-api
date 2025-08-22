import { prisma } from "../../../../prisma/prisma.js"
import { Prisma, TransactionType } from "@prisma/client"

export class PostgresGetUserBalanceRepository {
    async execute(userId, from, to) {
        const dateFilter = {
            date: {
                gte: new Date(from),
                lte: new Date(to),
            },
        }

        const {
            _sum: { amount: totalExpenses },
        } = await prisma.transaction.aggregate({
            where: {
                user_id: userId,
                type: TransactionType.EXPENSE,
                ...dateFilter,
            },
            _sum: {
                amount: true,
            },
        })

        const {
            _sum: { amount: totalEarnings },
        } = await prisma.transaction.aggregate({
            where: {
                user_id: userId,
                type: TransactionType.EARNING,
                ...dateFilter,
            },
            _sum: {
                amount: true,
            },
        })

        const {
            _sum: { amount: totalInvestments },
        } = await prisma.transaction.aggregate({
            where: {
                user_id: userId,
                type: TransactionType.INVESTMENT,
                ...dateFilter,
            },
            _sum: {
                amount: true,
            },
        })

        const _totalEarnings = totalEarnings || new Prisma.Decimal(0)
        const _totalExpenses = totalExpenses || new Prisma.Decimal(0)
        const _totalInvestments = totalInvestments || new Prisma.Decimal(0)
        //The method .plus() comes from Prisma.Decimal() return
        const total = _totalEarnings
            .plus(_totalExpenses)
            .plus(_totalInvestments)

        const balance = _totalEarnings
            .minus(_totalExpenses)
            .minus(_totalInvestments)

        const earningsPercentage = total.isZero()
            ? 0
            : _totalEarnings.div(total).times(100).floor()
        const expensesPercentage = total.isZero()
            ? 0
            : _totalExpenses.div(total).times(100).floor()
        const investmentsPercentage = total.isZero()
            ? 0
            : _totalInvestments.div(total).times(100).floor()

        return {
            earnings: _totalEarnings,
            expenses: _totalExpenses,
            investments: _totalInvestments,
            earningsPercentage,
            expensesPercentage,
            investmentsPercentage,
            balance,
        }

        //Used to consume the view, but it does note have the option to filter with date parameters
        //Prisma n suporta view, então precisei criar uma query direto mesmo, tem usar a estrutura do prisma pra fazer a consulta
        //   return await prisma.$queryRaw`
        //   SELECT * FROM user_balance_view WHERE user_id = ${userId}
        // `
    }
}
