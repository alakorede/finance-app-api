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
})
