import { DeleteTransactionUseCase } from "../../../src/use-cases/index.js"
import { faker } from "@faker-js/faker"

describe("DeleteTransactionUseCase", () => {
    const transactionId = faker.string.uuid()
    const transaction = {
        id: transactionId,
        user_id: faker.string.uuid(),
        name: faker.finance.accountName(),
        date: faker.date.anytime().toISOString(),
        amount: Number(faker.finance.amount(10, 1000)),
        type: faker.helpers.arrayElement(["EXPENSE", "INVESTMENT", "EARNING"]),
    }

    class deleteTransactionRepositoryStub {
        async execute() {
            return transaction
        }
    }

    const makeSut = () => {
        const deleteTransactionRepository =
            new deleteTransactionRepositoryStub()
        const sut = new DeleteTransactionUseCase(deleteTransactionRepository)

        return { deleteTransactionRepository, sut }
    }

    test("Should delete a transaction successfully", async () => {
        //arrange
        const { sut } = makeSut()
        //act
        const result = await sut.execute(transactionId)
        //assert
        expect(result).toEqual(transaction)
    })

    test("Should call DeleteTransactionRepository with correct params", async () => {
        //arrange
        const { sut, deleteTransactionRepository } = makeSut()
        const deleteTransactionRepositorySpy = import.meta.jest.spyOn(
            deleteTransactionRepository,
            "execute",
        )
        //act
        await sut.execute(transactionId)
        //assert
        expect(deleteTransactionRepositorySpy).toHaveBeenCalledWith(
            transactionId,
        )
    })

    test("Should throw if DeleteTransactionRepository throws", async () => {
        //arrange
        const { sut, deleteTransactionRepository } = makeSut()
        import.meta.jest
            .spyOn(deleteTransactionRepository, "execute")
            .mockRejectedValueOnce(new Error())
        //act
        const promise = sut.execute(transactionId)
        //assert
        await expect(promise).rejects.toThrow()
    })
})
