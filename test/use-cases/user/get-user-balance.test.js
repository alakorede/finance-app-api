import { GetUserBalanceUseCase } from "../../../src/use-cases/index.js"
//import { UserNotFoundError } from "../../../src/errors/user.js"
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

    test("Should get user balance successfully", async () => {
        //arrange
        const { sut } = makeSut()

        //act
        const result = await sut.execute(faker.string.uuid())
        //assert
        expect(result).toBeTruthy
        expect(result).toEqual(balance)
    })
})
