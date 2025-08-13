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

    const userId = faker.string.uuid()

    class UpdateTransactionRepositoryStub {
        async execute() {
            return transaction
        }
    }

    class GetTransactionByIdRepositoryStub {
        async execute() {
            return {
                user_id: userId,
            }
        }
    }

    const makeSut = () => {
        const getTransactionByIdRepository =
            new GetTransactionByIdRepositoryStub()
        const updateTransactionRepository =
            new UpdateTransactionRepositoryStub()

        const sut = new UpdateTransactionUseCase(
            updateTransactionRepository,
            getTransactionByIdRepository,
        )

        return { updateTransactionRepository, sut }
    }

    test("Should update a transaction successfully", async () => {
        //arrange
        const { sut } = makeSut()
        //act
        const result = await sut.execute(
            userId,
            faker.string.uuid(),
            transaction,
        )
        //assert
        expect(result).toEqual(transaction)
    })

    test("Should call UpdateTransactionRepository with correct params", async () => {
        //arrange
        const { sut, updateTransactionRepository } = makeSut()
        const updateTransactionRepositorySpy = import.meta.jest.spyOn(
            updateTransactionRepository,
            "execute",
        )
        const transactionId = faker.string.uuid()
        //act
        await sut.execute(userId, transactionId, transaction)
        //assert
        expect(updateTransactionRepositorySpy).toHaveBeenCalledWith(
            transactionId,
            transaction,
        )
    })

    test("Should throw when UpdateTransactionRepository throws", async () => {
        //arrange
        const { sut, updateTransactionRepository } = makeSut()
        import.meta.jest
            .spyOn(updateTransactionRepository, "execute")
            .mockRejectedValueOnce(new Error())
        //act
        const promise = sut.execute(userId, faker.string.uuid(), transaction)
        //assert
        await expect(promise).rejects.toThrow()
    })
})
