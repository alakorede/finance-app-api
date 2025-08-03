import { PostgresCreateUserRepository } from "../../../src/repositories/postgres/index.js"
import { prisma } from "../../../prisma/prisma.js"
import { faker } from "@faker-js/faker"

describe("CreateUserRepository", () => {
    const user = {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 7 }),
    }

    test("Should create usar on database successfully", async () => {
        const sut = new PostgresCreateUserRepository()

        const result = await sut.execute(user)

        expect(result.id).toBe(user.id)
        expect(result.first_name).toBe(user.first_name)
        expect(result.last_name).toBe(user.last_name)
        expect(result.email).toBe(user.email)
        expect(result.password).toBe(user.password)
    })

    test("Should call prisma with correct params", async () => {
        const sut = new PostgresCreateUserRepository()
        const prismaSpy = jest.spyOn(prisma.user, "create")

        await sut.execute(user)

        expect(prismaSpy).toHaveBeenCalledWith({ data: user })
    })

    test("Should throw if Prisma throws", async () => {
        const sut = new PostgresCreateUserRepository()
        jest.spyOn(prisma.user, "create").mockRejectedValueOnce(new Error())

        const promise = sut.execute(user)
        await expect(promise).rejects.toThrow()
    })
})
