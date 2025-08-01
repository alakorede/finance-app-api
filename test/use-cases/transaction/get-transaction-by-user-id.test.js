import { GetTransactionsByUserIdUseCase } from "../../../src/use-cases/index.js"
import { UserNotFoundError } from "../../../src/errors/user.js"
import { faker } from "@faker-js/faker"

describe("GetTransactionByUserIdUseCase", () => {
    const userId = faker.string.uuid()

    const transactions = [
        {
            id: faker.string.uuid(),
            name: faker.finance.accountName(),
            date: faker.date.anytime().toISOString(),
            amount: Number(faker.finance.amount(10, 1000)),
            type: faker.helpers.arrayElement([
                "EXPENSE",
                "INVESTMENT",
                "EARNING",
            ]),
        },
    ]

    class GetUserByIdRepositoryStub {
        async execute(userId) {
            return { userId: userId }
        }
    }
    class GetTransactionsByUserIdRepositoryStub {
        async execute(userId) {
            return [
                {
                    userId: userId,
                    ...transactions[0],
                },
            ]
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

    test("Should return user transactions successfully", async () => {
        //arrange
        const { sut } = makeSut()
        //act
        const result = await sut.execute(userId)
        //assert
        expect(result).toEqual([{ userId: userId, ...transactions[0] }])
    })

    test("Should throw UserNotFoundError if getUserByIdRepository return no user", async () => {
        //arrange
        const { sut, getUserByIdRepository } = makeSut()
        jest.spyOn(getUserByIdRepository, "execute").mockImplementationOnce(
            () => {
                return null
            },
        )
        //act
        const promise = sut.execute(userId)
        //assert
        await expect(promise).rejects.toThrow(new UserNotFoundError())
    })

    test("Should call GetUserByIdRepository with correct params", async () => {
        //arrange
        const { sut, getUserByIdRepository } = makeSut()
        const getUserByIdRepositoryjestSpy = jest.spyOn(
            getUserByIdRepository,
            "execute",
        )
        //act
        await sut.execute(userId)
        //assert
        expect(getUserByIdRepositoryjestSpy).toHaveBeenCalledWith(userId)
    })

    test("Should call GetTransactionsByUserIdRepository with correct params", async () => {
        //arrange
        const { sut, getTransactionsByUserIdRepository } = makeSut()
        const getTransactionsByUserIdRepositorySpy = jest.spyOn(
            getTransactionsByUserIdRepository,
            "execute",
        )
        //act
        await sut.execute(userId)
        //assert
        expect(getTransactionsByUserIdRepositorySpy).toHaveBeenCalledWith(
            userId,
        )
    })

    test("Should throw if GetUserByIdRepository throws", async () => {
        //arrange
        const { sut, getUserByIdRepository } = makeSut()
        jest.spyOn(getUserByIdRepository, "execute").mockRejectedValueOnce(
            new Error(),
        )
        //act
        const promise = sut.execute(userId)
        //assert
        await expect(promise).rejects.toThrow()
    })
})
