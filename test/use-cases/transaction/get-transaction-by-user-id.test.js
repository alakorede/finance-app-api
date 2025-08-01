import { GetTransactionsByUserIdUseCase } from "../../../src/use-cases/index.js"
import { faker } from "@faker-js/faker"

describe("GetTransactionByUserIdUseCase", () => {
    const userId = faker.string.uuid()

    const transaction = {
        id: faker.string.uuid(),
        name: faker.finance.accountName(),
        date: faker.date.anytime().toISOString(),
        amount: Number(faker.finance.amount(10, 1000)),
        type: faker.helpers.arrayElement(["EXPENSE", "INVESTMENT", "EARNING"]),
    }

    class GetUserByIdRepositoryStub {
        async execute(userId) {
            return { userId: userId }
        }
    }
    class GetTransactionsByUserIdRepositoryStub {
        async execute(userId) {
            return {
                userId: userId,
                ...transaction,
            }
        }
    }

    const makeSut = () => {
        const getUserByIdRepository = new GetUserByIdRepositoryStub()
        const getTransactionsByUserIdRepository =
            new GetTransactionsByUserIdRepositoryStub()
        const sut = new GetTransactionsByUserIdUseCase(
            getTransactionsByUserIdRepository,
            getUserByIdRepository,
        )

        return { getUserByIdRepository, getTransactionsByUserIdRepository, sut }
    }
    test("Should return a transaction successfully", async () => {
        //arrange
        const { sut } = makeSut()
        //act
        const result = await sut.execute(userId)
        //assert
        expect(result).toEqual({ userId: userId, ...transaction })
    })
})
