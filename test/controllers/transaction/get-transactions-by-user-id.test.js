import { GetTransactionsByUserIdController } from "../../../src/controllers/transaction/get-transactions-by-user-id.js"
import { UserNotFoundError } from "../../../src/errors/user.js"
import { faker } from "@faker-js/faker"

describe("GetTransactionsByUserIdController", () => {
    class GetTransactionsByUserIdUseCaseStub {
        async execute() {
            return {
                id: faker.string.uuid(),
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
        const getTransactionsByUserIdUseCase =
            new GetTransactionsByUserIdUseCaseStub()
        const sut = new GetTransactionsByUserIdController(
            getTransactionsByUserIdUseCase,
        )
        return { getTransactionsByUserIdUseCase, sut }
    }

    const httpRequest = {
        query: {
            userId: faker.string.uuid(),
        },
    }

    test("Should return StatusCode 200 with Transactions on body", async () => {
        //arrange
        const { sut } = makeSut()
        //act
        const result = await sut.execute(httpRequest)
        //assert
        expect(result.statusCode).toBe(200)
    })

    test("Should return StatusCode 400 with error message about id error when its in invalid format", async () => {
        //arrange
        const { sut } = makeSut()
        //act
        const result = await sut.execute({
            query: { userId: "invalid_ID" },
        })
        //assert
        expect(result.statusCode).toBe(400)
        expect(result.body.message).toBe(
            "Id must be provided and must be an UUID",
        )
    })

    test("Should return StatusCode 400 with error message about id error when its not provided", async () => {
        //arrange
        const { sut } = makeSut()
        //act
        const result = await sut.execute({
            query: { userId: undefined },
        })
        //assert
        expect(result.statusCode).toBe(400)
        expect(result.body.message).toBe(
            "Id must be provided and must be an UUID",
        )
    })

    test("Should return StatusCode 404 and User Not Found error when userId do not exists on DB", async () => {
        //arrange
        const { getTransactionsByUserIdUseCase, sut } = makeSut()

        jest.spyOn(
            getTransactionsByUserIdUseCase,
            "execute",
        ).mockImplementationOnce(() => {
            throw new UserNotFoundError()
        })
        //act
        const result = await sut.execute(httpRequest)
        //assert
        expect(result.statusCode).toBe(404)
        expect(result.body.message).toBe("User Not Found")
    })

    test("Should return StatusCode 500 and related message on Internal Server Error", async () => {
        //arrange
        const { getTransactionsByUserIdUseCase, sut } = makeSut()

        jest.spyOn(
            getTransactionsByUserIdUseCase,
            "execute",
        ).mockImplementationOnce(() => {
            throw new Error()
        })
        //act
        const result = await sut.execute(httpRequest)
        //assert
        expect(result.statusCode).toBe(500)
        expect(result.body.message).toBe("Internal Server Error")
    })

    test("Should call GetTransactionByUserIdUseCase with correct params", async () => {
        //arrange
        const { getTransactionsByUserIdUseCase, sut } = makeSut()

        const executeSpy = jest.spyOn(getTransactionsByUserIdUseCase, "execute")
        //act
        await sut.execute(httpRequest)
        //assert
        expect(executeSpy).toHaveBeenCalledWith(httpRequest.query.userId)
    })
})
