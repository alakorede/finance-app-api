import { GetUserBalanceController } from "../../../src/controllers/user/get-user-balance.js"
import { faker } from "@faker-js/faker"

describe("GetUserBalanceController", () => {
    class GetUserBalanceUseCaseStub {
        async execute() {
            return faker.number.int()
        }
    }

    const makeSut = () => {
        const getUserBalanceUseCase = new GetUserBalanceUseCaseStub()
        const sut = new GetUserBalanceController(getUserBalanceUseCase)

        return { getUserBalanceUseCase, sut }
    }

    const httpRequest = {
        params: {
            userId: faker.string.uuid(),
        },
    }

    test("Should return 200 when get user balance successfully", async () => {
        //arrange
        const { sut } = makeSut()
        //act
        const result = await sut.execute(httpRequest)
        console.log(result)
        //assert
        expect(result.statusCode).toBe(200)
        expect(result.body).not.toBe(undefined)
    })
})
