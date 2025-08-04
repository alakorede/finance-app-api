import { PostgresUpdateTransactionRepository } from "../../../src/repositories/postgres/index.js"
import { prisma } from "../../../prisma/prisma.js"
import { faker } from "@faker-js/faker"
import dayjs from "dayjs"

describe("PostgresUpdateTransactionRepository", () => {
    const user = {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 7 }),
    }

    const transaction = {
        id: faker.string.uuid(),
        user_id: user.id,
        name: faker.finance.accountName(),
        date: faker.date.anytime().toISOString(),
        amount: Number(faker.finance.amount(10, 1000)),
        type: faker.helpers.arrayElement(["EXPENSE", "INVESTMENT", "EARNING"]),
    }

    test("Should update a transaction on db", async () => {
        await prisma.user.create({ data: user })
        await prisma.transaction.create({ data: transaction })

        const sut = new PostgresUpdateTransactionRepository()

        const updateTransactionData = {
            name: faker.finance.accountName(),
            date: faker.date.anytime().toISOString(),
            amount: Number(faker.finance.amount(10, 1000)),
            type: faker.helpers.arrayElement([
                "EXPENSE",
                "INVESTMENT",
                "EARNING",
            ]),
        }

        const result = await sut.execute(transaction.id, updateTransactionData)

        expect(result.id).toBe(transaction.id)
        expect(result.user_id).toBe(transaction.user_id)
        expect(result.name).toBe(updateTransactionData.name)
        expect(dayjs(result.date).daysInMonth()).toBe(
            dayjs(updateTransactionData.date).daysInMonth(),
        )
        expect(dayjs(result.date).month()).toBe(
            dayjs(updateTransactionData.date).month(),
        )
        expect(dayjs(result.date).year()).toBe(
            dayjs(updateTransactionData.date).year(),
        )
        expect(Number(result.amount)).toBe(updateTransactionData.amount)
        expect(result.type).toBe(updateTransactionData.type)
    })
})
