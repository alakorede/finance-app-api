import { UpdateTransactionUseCase } from "../../../src/use-cases/index.js"
import { faker } from "@faker-js/faker"

describe("UpdateTransactionUseCase", () => {
    const transaction = {
        id: faker.string.uuid(),
        name: faker.finance.accountName(),
        date: faker.date.anytime().toISOString(),
        amount: Number(faker.finance.amount(10, 1000)),
        type: faker.helpers.arrayElement(["EXPENSE", "INVESTMENT", "EARNING"]),
    }

    class UpdateTransactionRepositoryStub {
        async execute() {
            return transaction
        }
    }

    const makeSut = () => {
        const updateTransactionRepository =
            new UpdateTransactionRepositoryStub()

        const sut = new UpdateTransactionUseCase(updateTransactionRepository)

        return { updateTransactionRepository, sut }
    }

    test("Should update a transaction successfully", async () => {
        //arrange
        const { sut } = makeSut()
        //act
        const result = await sut.execute(faker.string.uuid(), transaction)
        //assert
        expect(result).toEqual(transaction)
    })

    test("Should throw when UpdateTransactionRepository throws", async () => {
        //arrange
        const { sut, updateTransactionRepository } = makeSut()
        jest.spyOn(
            updateTransactionRepository,
            "execute",
        ).mockRejectedValueOnce(new Error())
        //act
        const promise = sut.execute(faker.string.uuid(), transaction)
        //assert
        await expect(promise).rejects.toThrow()
    })
})
