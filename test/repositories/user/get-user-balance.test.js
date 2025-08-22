import { PostgresGetUserBalanceRepository } from "../../../src/repositories/postgres"
import { prisma } from "../../../prisma/prisma.js"
import { faker } from "@faker-js/faker"

describe("PostgresGetUserBalanceRepository", () => {
    test("Should get user balance on db", async () => {
        const from = "1900-01-01"
        const to = "2030-12-31"

        const user = await prisma.user.create({
            data: {
                id: faker.string.uuid(),
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({ length: 7 }),
            },
        })

        await prisma.transaction.createMany({
            data: [
                {
                    user_id: user.id,
                    name: faker.finance.accountName(),
                    date: faker.date.anytime().toISOString(),
                    amount: 30000,
                    type: "EARNING",
                },
                {
                    user_id: user.id,
                    name: faker.finance.accountName(),
                    date: faker.date.anytime().toISOString(),
                    amount: 5000,
                    type: "EARNING",
                },
                {
                    user_id: user.id,
                    name: faker.finance.accountName(),
                    date: faker.date.anytime().toISOString(),
                    amount: 10000,
                    type: "INVESTMENT",
                },
                {
                    user_id: user.id,
                    name: faker.finance.accountName(),
                    date: faker.date.anytime().toISOString(),
                    amount: 10000,
                    type: "INVESTMENT",
                },
                {
                    user_id: user.id,
                    name: faker.finance.accountName(),
                    date: faker.date.anytime().toISOString(),
                    amount: 5000,
                    type: "EXPENSE",
                },
                {
                    user_id: user.id,
                    name: faker.finance.accountName(),
                    date: faker.date.anytime().toISOString(),
                    amount: 5000,
                    type: "EXPENSE",
                },
            ],
        })

        const sut = new PostgresGetUserBalanceRepository()
        const result = await sut.execute(user.id, from, to)

        expect(Number(result.earnings)).toBe(35000)
        expect(Number(result.expenses)).toBe(10000)
        expect(Number(result.investments)).toBe(20000)
        expect(Number(result.balance)).toBe(5000)
    })
})
