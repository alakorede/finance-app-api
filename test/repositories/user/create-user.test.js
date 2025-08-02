import { PostgresCreateUserRepository } from "../../../src/repositories/postgres/index.js"
import { faker } from "@faker-js/faker"

describe("CreateUserRepository", () => {
    test("Should create usar on database successfully", async () => {
        const user = {
            id: faker.string.uuid(),
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password({ length: 7 }),
        }
        const sut = new PostgresCreateUserRepository()

        const result = await sut.execute(user)

        expect(result.id).toBe(user.id)
        expect(result.first_name).toBe(user.first_name)
        expect(result.last_name).toBe(user.last_name)
        expect(result.email).toBe(user.email)
        expect(result.password).toBe(user.password)
    })
})
