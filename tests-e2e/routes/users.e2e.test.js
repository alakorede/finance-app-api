import request from "supertest"
import { app } from "../../src/app.js"
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

    test("GET /api/users should return 200 and user dara on body when user is found", async () => {
        const { body: createdUser } = await request(app)
            .post("/api/users")
            .send(userData)
        const response = await request(app)
            .get(`/api/users`)
            .set("Authorization", `Bearer ${createdUser.tokens.accessToken}`)

        expect(response.status).toBe(200)
        expect(response.body.id).toBe(createdUser.id)
        expect(response.body.password).toBe(createdUser.password)
        expect(response.body.first_name).toBe(createdUser.first_name)
        expect(response.body.last_name).toBe(createdUser.last_name)
        expect(response.body.email).toBe(createdUser.email)
    })

    test("PATCH /api/users should return 200 and userData up to date when user is updated", async () => {
        const { body: createdUser } = await request(app)
            .post("/api/users")
            .send(userData)

        const updateUser = {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password({ length: 7 }),
        }
        const response = await request(app)
            .patch(`/api/users`)
            .send(updateUser)
            .set("Authorization", `Bearer ${createdUser.tokens.accessToken}`)

        expect(response.status).toBe(200)
        expect(response.body.id).toBe(createdUser.id)
        expect(response.body.password).not.toBe(createdUser.password)
        expect(response.body.first_name).toBe(updateUser.first_name)
        expect(response.body.last_name).toBe(updateUser.last_name)
        expect(response.body.email).toBe(updateUser.email)
    })

    test("DELETE /api/users should return 200 and userData when user is deleted", async () => {
        const { body: createdUser } = await request(app)
            .post("/api/users")
            .send(userData)
        const response = await request(app)
            .delete(`/api/users`)
            .set("Authorization", `Bearer ${createdUser.tokens.accessToken}`)

        expect(response.status).toBe(200)
        expect(response.body.id).toBe(createdUser.id)
        expect(response.body.password).toBe(createdUser.password)
        expect(response.body.first_name).toBe(createdUser.first_name)
        expect(response.body.last_name).toBe(createdUser.last_name)
        expect(response.body.email).toBe(createdUser.email)
    })

    test("POST /api/users/login should return 200 and tokens on user login successfully", async () => {
        const { body: createdUser } = await request(app)
            .post("/api/users")
            .send(userData)

        const response = await request(app).post("/api/users/login").send({
            email: createdUser.email,
            password: userData.password,
        })

        expect(response.status).toBe(200)
        expect(response.body.tokens.accessToken).toBeDefined()
        expect(response.body.tokens.refreshToken).toBeDefined()
    })

    test("POST /api/users/login should return 401 on password fail", async () => {
        const { body: createdUser } = await request(app)
            .post("/api/users")
            .send(userData)

        const response = await request(app).post("/api/users/login").send({
            email: createdUser.email,
            password: "invalid_password",
        })

        expect(response.status).toBe(401)
    })

    test("POST /api/users/login should return 404 on user not found", async () => {
        const response = await request(app).post("/api/users/login").send({
            email: "anyemail@mail.com",
            password: "invalid_password",
        })

        expect(response.status).toBe(404)
    })

    test("POST /api/users/refresh-token should return status 200 with accessToken and refreshToken on body", async () => {
        const { body: createdUser } = await request(app)
            .post("/api/users")
            .send(userData)

        const { body: loginData } = await request(app)
            .post("/api/users/login")
            .send({
                email: createdUser.email,
                password: userData.password,
            })

        const response = await request(app)
            .post("/api/users/refresh-token")
            .send({ refreshToken: loginData.tokens.refreshToken })

        expect(response.status).toBe(200)
        expect(response.body.accessToken).toBeDefined()
        expect(response.body.refreshToken).toBeDefined()
    })

    test("POST /api/users/refresh-token should return status 401 on refreshToken invalid", async () => {
        const { body: createdUser } = await request(app)
            .post("/api/users")
            .send(userData)

        await request(app).post("/api/users/login").send({
            email: createdUser.email,
            password: userData.password,
        })

        const response = await request(app)
            .post("/api/users/refresh-token")
            .send({
                refreshToken: "invalid_token",
            })

        expect(response.status).toBe(401)
    })

    test("GET /api/users/balance should return 200 and correct balance info", async () => {
        const from = "1900-01-01"
        const to = "2030-12-31"

        const { body: createdUser } = await request(app)
            .post("/api/users")
            .send(userData)

        const transaction = {
            name: faker.finance.accountName(),
            date: faker.date.anytime().toISOString(),
        }

        await request(app)
            .post("/api/transactions")
            .send({
                ...transaction,
                amount: 10000,
                type: "EARNING",
            })
            .set("Authorization", `Bearer ${createdUser.tokens.accessToken}`)

        await request(app)
            .post("/api/transactions")
            .send({
                ...transaction,
                amount: 2000,
                type: "INVESTMENT",
            })
            .set("Authorization", `Bearer ${createdUser.tokens.accessToken}`)

        await request(app)
            .post("/api/transactions")
            .send({
                ...transaction,
                amount: 5000,
                type: "EXPENSE",
            })
            .set("Authorization", `Bearer ${createdUser.tokens.accessToken}`)

        const response = await request(app)
            .get(`/api/users/balance?from=${from}&to=${to}`)
            .set("Authorization", `Bearer ${createdUser.tokens.accessToken}`)

        expect(response.status).toBe(200)
        expect(response.body).toEqual({
            earnings: "10000",
            expenses: "5000",
            investments: "2000",
            earningsPercentage: "58",
            expensesPercentage: "29",
            investmentsPercentage: "11",
            balance: "3000",
        })
    })
})
