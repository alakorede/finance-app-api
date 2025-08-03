import { PostgresDeleteUserRepository } from "../../../src/repositories/postgres/index.js"
import { prisma } from "../../../prisma/prisma.js"
import { faker } from "@faker-js/faker"

describe("PostgresDeleteUserRepository", () => {
    const user = {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 7 }),
    }

    test("Should delete a user on db", async () => {
        await prisma.user.create({
            data: user,
        })

        const sut = new PostgresDeleteUserRepository()

        const result = await sut.execute(user.id)

        expect(result).toEqual(user)
    })

    test("Should call prisma with correct params", async () => {
        await prisma.user.create({
            data: user,
        })
        const sut = new PostgresDeleteUserRepository()
        const prismaSpy = jest.spyOn(prisma.user, "delete")

        await sut.execute(user.id)

        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                id: user.id,
            },
        })
    })
})
