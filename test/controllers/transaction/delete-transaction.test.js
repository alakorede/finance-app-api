import { DeleteTransactionController } from "../../../src/controllers/transaction/delete-transaction.js"
import { faker } from "@faker-js/faker"

describe("DeleteTransactionController", () => {
    class DeleteTransactionUseCaseStub {
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
        const deleteTransactionUseCase = new DeleteTransactionUseCaseStub()
        const sut = new DeleteTransactionController(deleteTransactionUseCase)

        return { deleteTransactionUseCase, sut }
    }

    const httpRequest = {
        params: {
            transactionId: faker.string.uuid(),
        },
    }

    test("should return statusCode 200 with deleted transaction data on body", async () => {
        //arrange
        const { sut } = makeSut()

        //act
        const result = await sut.execute(httpRequest)
        //assert
        expect(result.statusCode).toBe(200)
        expect(result.body).not.toBe(undefined)
    })

    test("should return statusCode 404, TransactionNotFoundError should be thrown and body message related to transaction nod found error", async () => {
        //arrange
        const { deleteTransactionUseCase, sut } = makeSut()

        jest.spyOn(deleteTransactionUseCase, "execute").mockImplementationOnce(
            () => {
                return null
            },
        )

        //act
        const result = await sut.execute(httpRequest)
        //assert
        expect(result.statusCode).toBe(404)
        expect(result.body.message).toBe("Transaction Not Found")
    })

    test("should return statusCode 400 and TransactionId format error", async () => {
        //arrange
        const { sut } = makeSut()

        //act
        const result = await sut.execute({
            params: { transactionId: "invalid_id" },
        })
        //assert
        expect(result.statusCode).toBe(400)
        expect(result.body.message).toBe(
            "Id must be provided and must be an UUID",
        )
    })

    test("Should call DeleteTransactionUseCase with correct params", async () => {
        //arrange
        const { deleteTransactionUseCase, sut } = makeSut()

        const executeSpy = jest.spyOn(deleteTransactionUseCase, "execute")
        //act
        await sut.execute(httpRequest)
        //assert
        expect(executeSpy).toHaveBeenCalledWith(
            httpRequest.params.transactionId,
        )
    })
})
