import { PostgresUpdateUserRepository } from "../../../src/repositories/postgres/index.js"
import { prisma } from "../../../prisma/prisma.js"
import { faker } from "@faker-js/faker"

describe("PostgresUpdateUserRepository", () => {
    test("Should update user on db", async () => {
        const user = await prisma.user.create({
            data: {
                id: faker.string.uuid(),
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({ length: 7 }),
            },
        })

        const sut = new PostgresUpdateUserRepository()

        const updateUserParams = {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password({ length: 7 }),
        }

        const result = await sut.execute(user.id, updateUserParams)

        expect(result.id).toBe(user.id)
        expect(result.first_name).toBe(updateUserParams.first_name)
        expect(result.last_name).toBe(updateUserParams.last_name)
        expect(result.email).toBe(updateUserParams.email)
        expect(result.password).toBe(updateUserParams.password)
    })
})
