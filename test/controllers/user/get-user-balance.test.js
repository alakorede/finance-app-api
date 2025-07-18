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
        //assert
        expect(result.statusCode).toBe(200)
        expect(result.body).not.toBe(undefined)
    })

    test("Should return 400 and related message about provide userID when do not send userID on request", async () => {
        //arrange
        const { sut } = makeSut()
        //act
        const result = await sut.execute({ params: {} })
        //assert
        expect(result.statusCode).toBe(400)
        expect(result.body.message).toBe(
            "Id must be provided and must be an UUID",
        )
    })

    test("Should return 400 and related message about provide userID when provided userID is not on the right format (UUID)", async () => {
        //arrange
        const { sut } = makeSut()
        //act
        const result = await sut.execute({ params: { userId: "invalid_id" } })
        //assert
        expect(result.statusCode).toBe(400)
        expect(result.body.message).toBe(
            "Id must be provided and must be an UUID",
        )
    })

    test("Should return 500 on internal error", async () => {
        //arrange
        const { getUserBalanceUseCase, sut } = makeSut()

        jest.spyOn(getUserBalanceUseCase, "execute").mockImplementationOnce(
            () => {
                throw new Error()
            },
        )
        //act
        const result = await sut.execute(httpRequest)
        //assert
        expect(result.statusCode).toBe(500)
    })
})
