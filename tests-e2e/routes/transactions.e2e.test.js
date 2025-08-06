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
})
