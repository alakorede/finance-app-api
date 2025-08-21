import { PostgresDeleteTransactionRepository } from "../../../src/repositories/postgres/index.js"
import { prisma } from "../../../prisma/prisma.js"
import { faker } from "@faker-js/faker"

describe("PostgresDeleteTransactionRepository", () => {
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

    test("Should delete a transaction from db", async () => {
        await prisma.user.create({ data: user })
        await prisma.transaction.create({ data: transaction })

        const sut = new PostgresDeleteTransactionRepository()

        const result = await sut.execute(transaction.id)

        expect(result.id).toBe(transaction.id)
        expect(result.user_id).toBe(transaction.user_id)
        expect(result.name).toBe(transaction.name)
        expect(Number(result.amount)).toBe(transaction.amount)
        expect(result.type).toBe(transaction.type)
    })

    test("Should call prisma with correct params", async () => {
        const prismaSpy = import.meta.jest.spyOn(prisma.transaction, "delete")

        const sut = new PostgresDeleteTransactionRepository()

        await sut.execute(transaction.id)

        expect(prismaSpy).toHaveBeenCalledWith({
            where: { id: transaction.id },
        })
    })

    test("Should return null if Prisma throws", async () => {
        const sut = new PostgresDeleteTransactionRepository()

        import.meta.jest
            .spyOn(prisma.transaction, "delete")
            .mockRejectedValueOnce(new Error())

        const promise = sut.execute(transaction.id)
        await expect(promise).resolves.toBe(null)
    })
})
