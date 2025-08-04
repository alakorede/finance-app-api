import { PostgresGetTransactionsByUserIdRepository } from "../../../src/repositories/postgres/index.js"
import { prisma } from "../../../prisma/prisma.js"
import { faker } from "@faker-js/faker"
import dayjs from "dayjs"

describe("PostgresGetTransactionByUserId", () => {
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

    test("Should return transaction taken by userID from db", async () => {
        await prisma.user.create({ data: user })
        await prisma.transaction.create({ data: transaction })

        const sut = new PostgresGetTransactionsByUserIdRepository()

        const result = await sut.execute(user.id)

        expect(result[0].id).toBe(transaction.id)
        expect(result[0].user_id).toBe(transaction.user_id)
        expect(result[0].name).toBe(transaction.name)
        expect(dayjs(result[0].date).daysInMonth()).toBe(
            dayjs(transaction.date).daysInMonth(),
        )
        expect(dayjs(result[0].date).month()).toBe(
            dayjs(transaction.date).month(),
        )
        expect(dayjs(result[0].date).year()).toBe(
            dayjs(transaction.date).year(),
        )
        expect(Number(result[0].amount)).toBe(transaction.amount)
        expect(result[0].type).toBe(transaction.type)
    })

    test("Should return an empty array if there is no transaction related to user on db", async () => {
        await prisma.user.create({ data: user })
        const sut = new PostgresGetTransactionsByUserIdRepository()

        const result = await sut.execute(user.id)

        expect(result).toEqual([])
    })

    test("Should call prisma with correct params", async () => {
        const prismaSpy = jest.spyOn(prisma.transaction, "findMany")

        const sut = new PostgresGetTransactionsByUserIdRepository()

        await sut.execute(user.id)

        expect(prismaSpy).toHaveBeenCalledWith({
            where: { user_id: user.id },
        })
    })
})
