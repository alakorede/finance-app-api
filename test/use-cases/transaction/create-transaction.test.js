import { UserNotFoundError } from "../../../src/errors/user"
import { CreateTransactionUseCase } from "../../../src/use-cases/index"
import { faker } from "@faker-js/faker"

describe("CreateTransactionUseCase", () => {
    const transactionId = faker.string.uuid()
    class createTransactionRepositoryStub {
        async execute(transaction) {
            return transaction
        }
    }

    class getUserByIdRepositoryStub {
        async execute(userId) {
            return { userId }
        }
    }

    class idGeneratorAdapterStub {
        execute() {
            return transactionId
        }
    }

    const makeSut = () => {
        const idGeneratorAdapter = new idGeneratorAdapterStub()
        const getUserByIdRepository = new getUserByIdRepositoryStub()
        const createTransactionRepository =
            new createTransactionRepositoryStub()
        const sut = new CreateTransactionUseCase(
            createTransactionRepository,
            getUserByIdRepository,
            idGeneratorAdapter,
        )

        return {
            idGeneratorAdapter,
            getUserByIdRepository,
            createTransactionRepository,
            sut,
        }
    }

    const transaction = {
        id: transactionId,
        user_id: faker.string.uuid(),
        name: faker.finance.accountName(),
        date: faker.date.anytime().toISOString(),
        amount: Number(faker.finance.amount(10, 1000)),
        type: faker.helpers.arrayElement(["EXPENSE", "INVESTMENT", "EARNING"]),
    }

    test("Should create a transaction successfully", async () => {
        //arrange
        const { sut } = makeSut()
        //act
        const result = await sut.execute(transaction)
        //assert
        expect(result).toEqual(transaction)
    })

    test("Should call GetUserByIdRepository with correct params", async () => {
        //arrange
        const { sut, getUserByIdRepository } = makeSut()
        const getUserByIdRepositorySpy = jest.spyOn(
            getUserByIdRepository,
            "execute",
        )
        //act
        await sut.execute(transaction)
        //assert
        expect(getUserByIdRepositorySpy).toHaveBeenCalledWith(
            transaction.user_id,
        )
    })

    test("Should call IdGeneratorAdapter", async () => {
        //arrange
        const { sut, idGeneratorAdapter } = makeSut()
        const idGeneratorAdapterSpy = jest.spyOn(idGeneratorAdapter, "execute")
        //act
        await sut.execute(transaction)
        //assert
        expect(idGeneratorAdapterSpy).toHaveBeenCalled()
    })

    test("Should throw UserNotFoundError when GetUserByIdRepository returns empty for user search", async () => {
        //arrange
        const { sut, getUserByIdRepository } = makeSut()
        jest.spyOn(getUserByIdRepository, "execute").mockResolvedValue(null)
        //act
        const promise = sut.execute(transaction)
        //assert
        await expect(promise).rejects.toThrow(
            new UserNotFoundError(transaction.user_id),
        )
    })

    test("Should throw if idGeneratorAdapter throws", async () => {
        //arrange
        const { getUserByIdRepository, sut } = makeSut()
        jest.spyOn(getUserByIdRepository, "execute").mockRejectedValueOnce(
            new Error(),
        )
        //act
        const promise = sut.execute(transaction)

        //assert
        await expect(promise).rejects.toThrow()
    })
})
