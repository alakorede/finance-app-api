import { UserNotFoundError } from "../../../src/errors/user.js"
import { GetUserBalanceUseCase } from "../../../src/use-cases/index.js"
import { faker } from "@faker-js/faker"

describe("GetUserBalanceUseCase", () => {
    const balance = {
        earnings: faker.finance.amount(),
        expenses: faker.finance.amount(),
        investments: faker.finance.amount(),
        balance: faker.finance.amount(),
    }

    class GetUserBalanceRepositoryStub {
        async execute() {
            return balance
        }
    }

    class GetUserByIdRepositoryStub {
        async execute() {
            return {
                id: faker.string.uuid(),
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({ length: 7 }),
            }
        }
    }

    const makeSut = () => {
        const getUserBalanceRepository = new GetUserBalanceRepositoryStub()
        const getUserByIdRepository = new GetUserByIdRepositoryStub()
        const sut = new GetUserBalanceUseCase(
            getUserBalanceRepository,
            getUserByIdRepository,
        )

        return { getUserBalanceRepository, getUserByIdRepository, sut }
    }

    const from = "2024-01-01"
    const to = "2025-08-21"

    test("Should get user balance successfully", async () => {
        //arrange
        const { sut } = makeSut()

        //act
        const result = await sut.execute(faker.string.uuid(), from, to)
        //assert
        expect(result).toBeTruthy
        expect(result).toEqual(balance)
    })

    test("Should throw UserNotFoundError if GetUserByIdRepository returns null", async () => {
        //arrange
        const { getUserByIdRepository, sut } = makeSut()
        import.meta.jest
            .spyOn(getUserByIdRepository, "execute")
            .mockResolvedValue(null)
        //act
        const promise = sut.execute(faker.string.uuid(), from, to)
        //assert
        await expect(promise).rejects.toThrow(new UserNotFoundError())
    })

    test("Should call GetUserByIdRepository with correct params", async () => {
        //arrange
        const { sut, getUserByIdRepository } = makeSut()
        const userId = faker.string.uuid()
        const getUserByIdRepositorySpy = import.meta.jest.spyOn(
            getUserByIdRepository,
            "execute",
        )
        //act
        await sut.execute(userId)
        //assert
        expect(getUserByIdRepositorySpy).toHaveBeenCalledWith(userId)
    })

    test("Should call GetUserBalanceRepository with correct params", async () => {
        //arrange
        const { sut, getUserBalanceRepository } = makeSut()
        const userId = faker.string.uuid()
        const executeSpy = import.meta.jest.spyOn(
            getUserBalanceRepository,
            "execute",
        )
        //act
        await sut.execute(userId, from, to)
        //assert
        expect(executeSpy).toHaveBeenCalledWith(userId, from, to)
    })

    test("Should throw if GetBalanceRepository trows", async () => {
        //arrange
        const { sut, getUserBalanceRepository } = makeSut()
        import.meta.jest
            .spyOn(getUserBalanceRepository, "execute")
            .mockRejectedValueOnce(new Error())

        //act
        const promise = sut.execute(faker.string.uuid(), from, to)

        //assert
        await expect(promise).rejects.toThrow()
    })

    test("Should throw if GetUserByIdRepository trows", async () => {
        //arrange
        const { sut, getUserByIdRepository } = makeSut()
        import.meta.jest
            .spyOn(getUserByIdRepository, "execute")
            .mockRejectedValueOnce(new Error())

        //act
        const promise = sut.execute(faker.string.uuid(), from, to)

        //assert
        await expect(promise).rejects.toThrow()
    })
})
