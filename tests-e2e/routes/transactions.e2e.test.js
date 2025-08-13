import request from "supertest"
import { app } from "../../src/app.js"
import { faker } from "@faker-js/faker"
import dayjs from "dayjs"

describe("UserRoutes E2E Tests", () => {
    const userData = {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 7 }),
    }

    const transaction = {
        //user_id: user.id,
        name: faker.finance.accountName(),
        date: faker.date.anytime().toISOString(),
        amount: Number(faker.finance.amount(10, 1000)),
        type: faker.helpers.arrayElement(["EXPENSE", "INVESTMENT", "EARNING"]),
    }

    test("POST /api/transaction should return 200 and new transaction data on body when transaction is created", async () => {
        const createdUser = await request(app).post("/api/users").send(userData)

        const response = await request(app)
            .post("/api/transactions")
            .send({ user_id: createdUser.body.id, ...transaction })
            .set(
                "Authorization",
                `Bearer ${createdUser.body.tokens.accessToken}`,
            )

        expect(response.status).toBe(200)
        expect(response.body.id).toBeTruthy()
        expect(response.body.user_id).toEqual(createdUser.body.id)
        expect(response.body.name).toEqual(transaction.name)
        expect(Number(response.body.amount)).toBe(transaction.amount)
        expect(response.body.type).toBe(transaction.type)
    })

    test("GET /api/transaction should return 200 and the transaction data on body", async () => {
        const createdUser = await request(app).post("/api/users").send(userData)

        const newTransaction = await request(app)
            .post("/api/transactions")
            .send({ user_id: createdUser.body.id, ...transaction })
            .set(
                "Authorization",
                `Bearer ${createdUser.body.tokens.accessToken}`,
            )

        const response = await request(app)
            .get(`/api/transactions?userId=${createdUser.body.id}`)
            .set(
                "Authorization",
                `Bearer ${createdUser.body.tokens.accessToken}`,
            )

        expect(response.status).toBe(200)
        expect(response.body[0].id).toBe(newTransaction.body.id)
        expect(response.body[0].user_id).toBe(createdUser.body.id)
        expect(response.body[0].name).toEqual(newTransaction.body.name)
        expect(dayjs(response.body[0].date).daysInMonth()).toBe(
            dayjs(newTransaction.body.date).daysInMonth(),
        )
        expect(dayjs(response.body[0].date).month()).toBe(
            dayjs(newTransaction.body.date).month(),
        )
        expect(dayjs(response.body[0].date).year()).toBe(
            dayjs(newTransaction.body.date).year(),
        )
        expect(response.body[0].amount).toBe(newTransaction.body.amount)
        expect(response.body[0].type).toBe(newTransaction.body.type)
    })

    test("DELETE /api/transaction should return 200 and transaction on body when a transaction is deleted", async () => {
        const createdUser = await request(app).post("/api/users").send(userData)

        const newTransaction = await request(app)
            .post("/api/transactions")
            .send({ user_id: createdUser.body.id, ...transaction })
            .set(
                "Authorization",
                `Bearer ${createdUser.body.tokens.accessToken}`,
            )

        const response = await request(app)
            .delete(`/api/transactions/${newTransaction.body.id}`)
            .set(
                "Authorization",
                `Bearer ${createdUser.body.tokens.accessToken}`,
            )

        expect(response.status).toBe(200)
        expect(response.body.id).toBe(newTransaction.body.id)
        expect(response.body.user_id).toBe(createdUser.body.id)
        expect(response.body.name).toEqual(newTransaction.body.name)
        expect(dayjs(response.body.date).daysInMonth()).toBe(
            dayjs(newTransaction.body.date).daysInMonth(),
        )
        expect(dayjs(response.body.date).month()).toBe(
            dayjs(newTransaction.body.date).month(),
        )
        expect(dayjs(response.body.date).year()).toBe(
            dayjs(newTransaction.body.date).year(),
        )
        expect(response.body.amount).toBe(newTransaction.body.amount)
        expect(response.body.type).toBe(newTransaction.body.type)
    })

    test("UPDATE /api/transaction should return 200 and transaction on body with updated data when a transaction is updated", async () => {
        const updateTransactionData = {
            name: faker.finance.accountName(),
            date: faker.date.anytime().toISOString(),
            amount: Number(faker.finance.amount(10, 1000)),
            type: faker.helpers.arrayElement([
                "EXPENSE",
                "INVESTMENT",
                "EARNING",
            ]),
        }

        const createdUser = await request(app).post("/api/users").send(userData)

        const newTransaction = await request(app)
            .post("/api/transactions")
            .send({ user_id: createdUser.body.id, ...transaction })
            .set(
                "Authorization",
                `Bearer ${createdUser.body.tokens.accessToken}`,
            )

        const response = await request(app)
            .patch(`/api/transactions/${newTransaction.body.id}`)
            .send(updateTransactionData)
            .set(
                "Authorization",
                `Bearer ${createdUser.body.tokens.accessToken}`,
            )

        expect(response.status).toBe(200)
        expect(response.body.id).toBe(newTransaction.body.id)
        expect(response.body.user_id).toBe(createdUser.body.id)
        expect(response.body.name).toEqual(updateTransactionData.name)
        expect(Number(response.body.amount)).toBe(updateTransactionData.amount)
        expect(response.body.type).toBe(updateTransactionData.type)
    })
})
