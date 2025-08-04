import request from "supertest"
import { app } from "../../index.js"
import { faker } from "@faker-js/faker"

describe("UserRoutes E2E Tests", () => {
    const userData = {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 7 }),
    }
    test("POST /api/users should return 200 and user data on body when user is created", async () => {
        const response = await request(app).post("/api/users").send(userData)

        expect(response.status).toBe(200)
        expect(response.body.id).toBeTruthy()
        expect(response.body.password).toBeTruthy()
        expect(response.body.first_name).toBe(userData.first_name)
        expect(response.body.last_name).toBe(userData.last_name)
        expect(response.body.email).toBe(userData.email)
    })

    test("GET /api/users:userId should return 200 and user dara on body when user is found", async () => {
        const { body: createdUser } = await request(app)
            .post("/api/users")
            .send(userData)
        const response = await request(app).get(`/api/users/${createdUser.id}`)

        expect(response.status).toBe(200)
        expect(response.body.id).toBe(createdUser.id)
        expect(response.body.password).toBe(createdUser.password)
        expect(response.body.first_name).toBe(createdUser.first_name)
        expect(response.body.last_name).toBe(createdUser.last_name)
        expect(response.body.email).toBe(createdUser.email)
    })
})
