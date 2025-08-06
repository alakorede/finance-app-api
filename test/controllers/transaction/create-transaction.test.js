import { CreateTransactionController } from "../../../src/controllers/transaction/create-transaction.js"
import { faker } from "@faker-js/faker"

describe("CreateTransacionController", () => {
    class CreateTransactionUseCaseStub {
        async execute(transaction) {
            return transaction
        }
    }

    const makeSut = () => {
        const createTransactionUseCase = new CreateTransactionUseCaseStub()
        const sut = new CreateTransactionController(createTransactionUseCase)
        return { createTransactionUseCase, sut }
    }

    const httpRequest = {
        body: {
            user_id: faker.string.uuid(),
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

    test("should return transaction data on body when created succesfully and statusCode 200", async () => {
        //arrange
        const { sut } = makeSut()

        //act
        const result = await sut.execute(httpRequest)

        //assert
        expect(result.statusCode).toBe(200)
        expect(result.body).not.toBeNull()
        expect(result.body).not.toBeUndefined()
        expect(result.body).toEqual(httpRequest.body)
    })

    test("should return statusCode 400 with user_id required message when user_id is missing", async () => {
        //arrange
        const { sut } = makeSut()

        //act
        const result = await sut.execute({
            body: {
                ...httpRequest.body,
                user_id: undefined,
            },
        })

        //assert
        expect(result.statusCode).toBe(400)
        expect(result.body.message).toBe("user_id required")
    })

    test("should return statusCode 400 requiring user_id at UUID format when format is invalid", async () => {
        //arrange
        const { sut } = makeSut()

        //act
        const result = await sut.execute({
            body: {
                ...httpRequest.body,
                user_id: "invalid_user_id",
            },
        })

        //assert
        expect(result.statusCode).toBe(400)
        expect(result.body.message).toBe("user_id must be a valid UUID")
    })

    test("should return statusCode 400 with name required message when name is missing", async () => {
        //arrange
        const { sut } = makeSut()

        //act
        const result = await sut.execute({
            body: {
                ...httpRequest.body,
                name: undefined,
            },
        })

        //assert
        expect(result.statusCode).toBe(400)
        expect(result.body.message).toBe("name required")
    })

    test("should return statusCode 400 with date required message when date is missing", async () => {
        //arrange
        const { sut } = makeSut()

        //act
        const result = await sut.execute({
            body: {
                ...httpRequest.body,
                date: undefined,
            },
        })

        //assert
        expect(result.statusCode).toBe(400)
        expect(result.body.message).toBe("date required")
    })

    test("should return statusCode 400 requiring date in ISOString format when date is in an invalid format", async () => {
        //arrange
        const { sut } = makeSut()

        //act
        const result = await sut.execute({
            body: {
                ...httpRequest.body,
                date: "invalid_date",
            },
        })

        //assert
        expect(result.statusCode).toBe(400)
        expect(result.body.message).toBe(
            "date must be in a valid date format ISOString",
        )
    })

    test("should return statusCode 400 requiring type to be EXPENSE, EARNING or INVESTMENT when type is not provided", async () => {
        //arrange
        const { sut } = makeSut()

        //act
        const result = await sut.execute({
            body: {
                ...httpRequest.body,
                type: undefined,
            },
        })

        //assert
        expect(result.statusCode).toBe(400)
        expect(result.body.message).toBe(
            "Type must be EXPENSE, EARNING or INVESTMENT",
        )
    })

    test("should return statusCode 400 requiring type to be EXPENSE, EARNING or INVESTMENT when type is provided with invalid data", async () => {
        //arrange
        const { sut } = makeSut()

        //act
        const result = await sut.execute({
            body: {
                ...httpRequest.body,
                type: "invalid_type",
            },
        })

        //assert
        expect(result.statusCode).toBe(400)
        expect(result.body.message).toBe(
            "Type must be EXPENSE, EARNING or INVESTMENT",
        )
    })

    test("should return statusCode 400 requiring amount when amount is not provided", async () => {
        //arrange
        const { sut } = makeSut()

        //act
        const result = await sut.execute({
            body: {
                ...httpRequest.body,
                amount: undefined,
            },
        })

        //assert
        expect(result.statusCode).toBe(400)
        expect(result.body.message).toBe("amount required")
    })

    test("should return statusCode 400 requiring amount when amount is provided with wrong format", async () => {
        //arrange
        const { sut } = makeSut()

        //act
        const result = await sut.execute({
            body: {
                ...httpRequest.body,
                amount: "invalid_amount",
            },
        })

        //assert
        expect(result.statusCode).toBe(400)
        expect(result.body.message).toBe("amount must be a number")
    })

    test("should return statusCode 400 requiring amount when amount is provided as 0 or below", async () => {
        //arrange
        const { sut } = makeSut()

        //act
        const result = await sut.execute({
            body: {
                ...httpRequest.body,
                amount: 0,
            },
        })

        //assert
        expect(result.statusCode).toBe(400)
        expect(result.body.message).toBe("Amount must be greater than 0")
    })
    test("Should return 500 on internal error", async () => {
        //arrange
        const { createTransactionUseCase, sut } = makeSut()

        import.meta.jest
            .spyOn(createTransactionUseCase, "execute")
            .mockImplementationOnce(() => {
                throw new Error()
            })
        //act
        const result = await sut.execute(httpRequest)
        //assert
        expect(result.statusCode).toBe(500)
        expect(result.body.message).toBe("Internal Server Error")
    })

    test("Should call CreateTransactionUseCase with correct params", async () => {
        //arrange
        const { createTransactionUseCase, sut } = makeSut()

        const executeSpy = import.meta.jest.spyOn(
            createTransactionUseCase,
            "execute",
        )
        //act
        await sut.execute(httpRequest)
        //assert
        expect(executeSpy).toHaveBeenCalledWith(httpRequest.body)
    })
})
