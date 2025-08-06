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
        expect(response.status).toBe(200)
        expect(response.body.id).toBeTruthy()
        expect(response.body.user_id).toEqual(createdUser.body.id)
        expect(response.body.name).toEqual(transaction.name)
        expect(dayjs(response.body.date).daysInMonth()).toBe(
            dayjs(transaction.date).daysInMonth(),
        )
        expect(dayjs(response.body.date).month()).toBe(
            dayjs(transaction.date).month(),
        )
        expect(dayjs(response.body.date).year()).toBe(
            dayjs(transaction.date).year(),
        )
        expect(Number(response.body.amount)).toBe(transaction.amount)
        expect(response.body.type).toBe(transaction.type)
    })

    test("GET /api/transaction should return 200 and the transaction data on body", async () => {
        const createdUser = await request(app).post("/api/users").send(userData)
        const newTransaction = await request(app)
            .post("/api/transactions")
            .send({ user_id: createdUser.body.id, ...transaction })

        const response = await request(app).get(
            `/api/transactions?userId=${createdUser.body.id}`,
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
})
