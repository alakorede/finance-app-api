import { GetUserByIdController } from "../../../src/controllers/user/get-user-by-id.js"
import { faker } from "@faker-js/faker"

describe("GetUserByIdController", () => {
    class GetUserByIdUseCaseStub {
        execute(userId) {
            return {
                id: userId,
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({ length: 7 }),
            }
        }
    }

    const makeSut = () => {
        const getUserByIdUseCase = new GetUserByIdUseCaseStub()
        const sut = new GetUserByIdController(getUserByIdUseCase)

        return { getUserByIdUseCase, sut }
    }

    const httpRequest = {
        params: {
            userId: faker.string.uuid(),
        },
    }

    test("Should return 200 and user data on find user successfully", async () => {
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
        const result = await sut.execute({
            params: { userId: "invalid_id" },
        })
        //assert
        expect(result.statusCode).toBe(400)
        expect(result.body.message).toBe(
            "Id must be provided and must be an UUID",
        )
    })

    test("Should return 404 on user not found error", async () => {
        //arrange
        const { getUserByIdUseCase, sut } = makeSut()

        import.meta.jest
            .spyOn(getUserByIdUseCase, "execute")
            .mockReturnValueOnce(null)
        //act
        const result = await sut.execute(httpRequest)
        //assert
        expect(result.statusCode).toBe(404)
    })

    test("Should return 500 on internal error", async () => {
        //arrange
        const { getUserByIdUseCase, sut } = makeSut()

        import.meta.jest
            .spyOn(getUserByIdUseCase, "execute")
            .mockImplementationOnce(() => {
                throw new Error()
            })
        //act
        const result = await sut.execute(httpRequest)
        //assert
        expect(result.statusCode).toBe(500)
    })

    test("Should call GetUserByIdUseCase with correct params", async () => {
        //arrange
        const { getUserByIdUseCase, sut } = makeSut()

        const executeSpy = import.meta.jest.spyOn(getUserByIdUseCase, "execute")
        //act
        await sut.execute(httpRequest)
        //assert
        expect(executeSpy).toHaveBeenCalledWith(httpRequest.params.userId)
    })
})
