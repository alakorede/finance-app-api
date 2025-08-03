import { PostgresUpdateUserRepository } from "../../../src/repositories/postgres/index.js"
import { prisma } from "../../../prisma/prisma.js"
import { faker } from "@faker-js/faker"

describe("PostgresUpdateUserRepository", () => {
    const user = {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 7 }),
    }

    const updateUserParams = {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 7 }),
    }

    test("Should update user on db", async () => {
        await prisma.user.create({
            data: user,
        })

        const sut = new PostgresUpdateUserRepository()

        const result = await sut.execute(user.id, updateUserParams)

        expect(result.id).toBe(user.id)
        expect(result.first_name).toBe(updateUserParams.first_name)
        expect(result.last_name).toBe(updateUserParams.last_name)
        expect(result.email).toBe(updateUserParams.email)
        expect(result.password).toBe(updateUserParams.password)
    })

    test("Should call prisma with correct params", async () => {
        await prisma.user.create({
            data: user,
        })
        const sut = new PostgresUpdateUserRepository()
        const prismaSpy = jest.spyOn(prisma.user, "update")

        await sut.execute(user.id, updateUserParams)

        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                id: user.id,
            },
            data: updateUserParams,
        })
    })

    test("Should call prisma findUnique with correct params to check if the user exists on db", async () => {
        await prisma.user.create({
            data: user,
        })
        const sut = new PostgresUpdateUserRepository()
        const prismaSpy = jest.spyOn(prisma.user, "findUnique")

        await sut.execute(user.id, updateUserParams)

        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                id: user.id,
            },
        })
    })
})
