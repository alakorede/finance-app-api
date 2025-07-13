import { DeleteUserController } from "../../../src/controllers/user/delete-user.js"
import { faker } from "@faker-js/faker"

describe("DeleteUserController", () => {
    class DeleteUserUseCaseStub {
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
        const deleteUserUseCase = new DeleteUserUseCaseStub()
        const sut = new DeleteUserController(deleteUserUseCase)

        return { deleteUserUseCase, sut }
    }

    const httpRequest = {
        params: {
            userId: faker.string.uuid(),
        },
    }

    test("Should return 200 and user data on delete successfully", async () => {
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
        const { deleteUserUseCase, sut } = makeSut()

        jest.spyOn(deleteUserUseCase, "execute").mockImplementationOnce(() => {
            throw new Error()
        })
        //act
        const result = await sut.execute(httpRequest)
        //assert
        expect(result.statusCode).toBe(500)
    })

    test("Should return 404 on user not found error", async () => {
        //arrange
        const { deleteUserUseCase, sut } = makeSut()

        jest.spyOn(deleteUserUseCase, "execute").mockReturnValueOnce(null)
        //act
        const result = await sut.execute(httpRequest)
        //assert
        expect(result.statusCode).toBe(404)
    })
})
