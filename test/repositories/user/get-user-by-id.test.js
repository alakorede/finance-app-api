import { PostgresGetUserByIdRepository } from "../../../src/repositories/postgres/index.js"
import { prisma } from "../../../prisma/prisma.js"
import { faker } from "@faker-js/faker"

describe("PostgresGetUserByIdRepository", () => {
    const user = {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 7 }),
    }

    test("Should return user from search on DB by ID", async () => {
        await prisma.user.create({
            data: user,
        })

        const sut = new PostgresGetUserByIdRepository()
        const result = await sut.execute(user.id)

        expect(result).toEqual(user)
    })

    test("Should call prisma with correct params", async () => {
        const sut = new PostgresGetUserByIdRepository()

        const prismaSpy = jest.spyOn(prisma.user, "findUnique")

        await sut.execute(user.id)

        expect(prismaSpy).toHaveBeenCalledWith({ where: { id: user.id } })
    })
})
