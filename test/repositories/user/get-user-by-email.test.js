import { PostgresGetUserByEmailRepository } from "../../../src/repositories/postgres/index.js"
import { prisma } from "../../../prisma/prisma.js"
import { faker } from "@faker-js/faker"

describe("PostgresGetUserByEmailRepository", () => {
    test("Should get user by e-mail from db", async () => {
        const user = await prisma.user.create({
            data: {
                id: faker.string.uuid(),
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({ length: 7 }),
            },
        })

        const sut = new PostgresGetUserByEmailRepository()

        const result = await sut.execute(user.email)

        expect(result).toEqual(user)
    })

    test("Should call prisma with correct params", async () => {
        const sut = new PostgresGetUserByEmailRepository()
        const email = faker.internet.email()

        const prismaSpy = jest.spyOn(prisma.user, "findUnique")

        await sut.execute(email)

        expect(prismaSpy).toHaveBeenCalledWith({ where: { email: email } })
    })
})
