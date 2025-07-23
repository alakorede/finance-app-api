import { UpdateTransactionController } from "../../../src/controllers/transaction/update-transaction.js"
import { faker } from "@faker-js/faker"

describe("UpdateTransactionController", () => {
    class UpdateTransactionUseCaseStub {
        async execute(transactionId) {
            return {
                id: transactionId,
                user_id: faker.string.uuid(),
                name: faker.finance.accountName(),
                date: faker.date.anytime().toISOString(),
                amount: Number(faker.finance.amount(10, 1000)),
                type: faker.helpers.arrayElement([
                    "EXPENSE",
                    "INVESTMENT",
                    "EARNING",
                ]),
            }
        }
    }

    const makeSut = () => {
        const updateTransactionUseCase = new UpdateTransactionUseCaseStub()
        const sut = new UpdateTransactionController(updateTransactionUseCase)

        return { updateTransactionUseCase, sut }
    }

    const httpRequest = {
        params: {
            transactionId: faker.string.uuid(),
        },
        body: {
            name: faker.finance.accountName(),
            date: faker.date.anytime().toISOString(),
            amount: Number(faker.finance.amount(10, 1000)),
            type: faker.helpers.arrayElement([
                "EXPENSE",
                "INVESTMENT",
                "EARNING",
            ]),
        },
    }

    test("Should return statusCode 200 and the Transaction object on body", async () => {
        //arrange
        const { sut } = makeSut()
        //act
        const result = await sut.execute(httpRequest)
        //assert
        expect(result.statusCode).toBe(200)
        expect(result.body).not.toBe(undefined)
    })

    test("Should return statusCode 400 and TransactionId not provided error message when the data is not sent on params", async () => {
        //arrange
        const { sut } = makeSut()
        //act
        const result = await sut.execute({
            params: { transactionId: undefined },
            body: httpRequest.body,
        })
        //assert
        expect(result.statusCode).toBe(400)
        expect(result.body.message).toBe(
            "Id must be provided and must be an UUID",
        )
    })

    test("Should return statusCode 400 and TransactionId error message when the data in invalid format", async () => {
        //arrange
        const { sut } = makeSut()
        //act
        const result = await sut.execute({
            params: { transactionId: "invalid_ID" },
            body: httpRequest.body,
        })
        //assert
        expect(result.statusCode).toBe(400)
        expect(result.body.message).toBe(
            "Id must be provided and must be an UUID",
        )
    })

    test("Should return statusCode 400 and name error message when the data is empty", async () => {
        //arrange
        const { sut } = makeSut()
        //act
        const result = await sut.execute({
            params: httpRequest.params,
            body: { name: "" },
        })
        //assert
        expect(result.statusCode).toBe(400)
        expect(result.body.message).toBe("name is required")
    })

    test("Should return statusCode 400 and name error message when the data invalid", async () => {
        //arrange
        const { sut } = makeSut()
        //act
        const result = await sut.execute({
            params: httpRequest.params,
            body: { name: null },
        })
        //assert
        expect(result.statusCode).toBe(400)
        expect(result.body.message).toBe("Expected string, received null")
    })

    test("Should return statusCode 400 and date error message when the data is in invalid format", async () => {
        //arrange
        const { sut } = makeSut()
        //act
        const result = await sut.execute({
            params: httpRequest.params,
            body: { date: "invalid_date" },
        })
        //assert
        expect(result.statusCode).toBe(400)
        expect(result.body.message).toBe(
            "date must be in a valid date format ISOString",
        )
    })

    test("Should return statusCode 400 and date error message when variable is sent but data is not provided", async () => {
        //arrange
        const { sut } = makeSut()
        //act
        const result = await sut.execute({
            params: httpRequest.params,
            body: { date: "" },
        })
        //assert
        expect(result.statusCode).toBe(400)
        expect(result.body.message).toBe(
            "date must be in a valid date format ISOString",
        )
    })

    test("Should return statusCode 400 and amount error message when variable is sent but data is not provided", async () => {
        //arrange
        const { sut } = makeSut()
        //act
        const result = await sut.execute({
            params: httpRequest.params,
            body: { amount: "" },
        })
        //assert
        expect(result.statusCode).toBe(400)
        expect(result.body.message).toBe("amount must be a number")
    })

    test("Should return statusCode 400 and amount error message when data is 0 or less - invalid", async () => {
        //arrange
        const { sut } = makeSut()
        //act
        const result = await sut.execute({
            params: httpRequest.params,
            body: { amount: -1 },
        })
        //assert
        expect(result.statusCode).toBe(400)
        expect(result.body.message).toBe("Amount must be greater than 0")
    })

    test("Should return statusCode 400 and type error message when variable is sent but data is not provided", async () => {
        //arrange
        const { sut } = makeSut()
        //act
        const result = await sut.execute({
            params: httpRequest.params,
            body: { type: "" },
        })
        //assert
        expect(result.statusCode).toBe(400)
        expect(result.body.message).toBe(
            "Type must be EXPENSE, EARNING or INVESTMENT",
        )
    })

    test("Should return statusCode 400 and type error message when data is provided in wrong format", async () => {
        //arrange
        const { sut } = makeSut()
        //act
        const result = await sut.execute({
            params: httpRequest.params,
            body: { type: "invalid_Type" },
        })
        //assert
        expect(result.statusCode).toBe(400)
        expect(result.body.message).toBe(
            "Type must be EXPENSE, EARNING or INVESTMENT",
        )
    })

    test("Should return statusCode 404 and Transaction not found error", async () => {
        //arrange
        const { updateTransactionUseCase, sut } = makeSut()
        jest.spyOn(updateTransactionUseCase, "execute").mockReturnValueOnce(
            null,
        )
        //act
        const result = await sut.execute(httpRequest)
        //assert
        expect(result.statusCode).toBe(404)
        expect(result.body.message).toBe("Transaction Not Found")
    })

    test("Should call UpdateTransactionUseCase with correct params", async () => {
        //arrange
        const { updateTransactionUseCase, sut } = makeSut()

        const executeSpy = jest.spyOn(updateTransactionUseCase, "execute")
        //act
        await sut.execute(httpRequest)
        //assert
        expect(executeSpy).toHaveBeenCalledWith(
            httpRequest.params.transactionId,
            httpRequest.body,
        )
    })
})
