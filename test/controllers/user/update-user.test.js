import { UpdateUserController } from "../../../src/controllers/user/update-user.js"
import { EmailAlreadyInUseError } from "../../../src/errors/user.js"
import { faker } from "@faker-js/faker"

describe("UpdateUserController", () => {
    class UpdateUserUseCaseStub {
        async execute(userId, updateParams) {
            return {
                id: userId,
                ...updateParams,
            }
        }
    }

    const makeSut = () => {
        const updateUserUseCase = new UpdateUserUseCaseStub()
        const sut = new UpdateUserController(updateUserUseCase)

        return { updateUserUseCase, sut }
    }

    const httpRequest = {
        body: {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password({ length: 7 }),
        },
        params: {
            userId: faker.string.uuid(),
        },
    }

    test("Should return 200 and userData on user updated Successfully", async () => {
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

    test("should return statusCode 400 and message on body related to first_name provided with fails", async () => {
        //arrange
        const { sut } = makeSut()

        //act
        const result = await sut.execute({
            params: httpRequest.params,
            body: { ...httpRequest.body, first_name: " " },
        })

        //assert
        expect(result.statusCode).toBe(400)
        expect(result.body.message).toBe("first_name required")
    })

    test("should return statusCode 400 and message on body related to last_name provided with fails", async () => {
        //arrange
        const { sut } = makeSut()

        //act
        const result = await sut.execute({
            params: httpRequest.params,
            body: { ...httpRequest.body, last_name: " " },
        })

        //assert
        expect(result.statusCode).toBe(400)
        expect(result.body.message).toBe("last_name required")
    })

    test("should return statusCode 400 and message on body related to email is provided but empty", async () => {
        //arrange
        const { sut } = makeSut()

        //act
        const result = await sut.execute({
            params: httpRequest.params,
            body: { ...httpRequest.body, email: " " },
        })

        //assert
        expect(result.statusCode).toBe(400)
        expect(result.body.message).toBe("Provide a valid e-mail")
    })

    test("should return statusCode 400 and message on body related to email is provided with wrong format", async () => {
        //arrange
        const { sut } = makeSut()

        //act
        const result = await sut.execute({
            params: httpRequest.params,
            body: { ...httpRequest.body, email: "invalid_email" },
        })

        //assert
        expect(result.statusCode).toBe(400)
        expect(result.body.message).toBe("Provide a valid e-mail")
    })

    test("should return statusCode 400 and message on body related to password with less than 6 characteres", async () => {
        //arrange
        const { sut } = makeSut()

        //act
        const result = await sut.execute({
            params: httpRequest.params,
            body: {
                ...httpRequest.body,
                password: faker.internet.password({ length: 3 }),
            },
        })

        //assert
        expect(result.statusCode).toBe(400)
        expect(result.body.message).toBe(
            "Password must have at least 6 characters",
        )
    })

    test("Should return 404 on user not found error when userId does not exist on DB", async () => {
        //arrange
        const { updateUserUseCase, sut } = makeSut()

        jest.spyOn(updateUserUseCase, "execute").mockReturnValueOnce(null)
        //act
        const result = await sut.execute(httpRequest)
        //assert
        expect(result.statusCode).toBe(404)
        expect(result.body.message).toBe("User Not Found")
    })

    test("Should return statusCode 400and related message on body if UpdateUserUseCase throws EmailIsAlreadyInUseError  ", async () => {
        //arrange
        const { updateUserUseCase, sut } = makeSut()

        //act
        jest.spyOn(updateUserUseCase, "execute").mockImplementationOnce(() => {
            throw new EmailAlreadyInUseError(httpRequest.body.email)
        })

        const result = await sut.execute(httpRequest)

        //assert
        expect(result.statusCode).toBe(400)
        expect(result.body.message).toBe(
            "The provided e-mail is already in use.",
        )
    })
})
