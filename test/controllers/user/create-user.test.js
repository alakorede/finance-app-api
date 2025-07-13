import { CreateUserController } from "../../../src/controllers/user/create-user.js"
import { EmailAlreadyInUseError } from "../../../src/errors/user.js"
import { faker } from "@faker-js/faker"

describe("Create User Controller", () => {
    //stub
    class CreateUserUseCaseStub {
        execute(user) {
            return user
        }
    }

    it("should return user data on body when created succesfully and statusCode 200", async () => {
        //arrange
        const createUserUseCase = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(createUserUseCase)

        const httpRequest = {
            body: {
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({ length: 7 }),
            },
        }

        //act
        const result = await createUserController.execute(httpRequest)

        //assert
        expect(result.statusCode).toBe(200)
        expect(result.body).not.toBeNull()
        expect(result.body).not.toBeUndefined()
        expect(result.body).toEqual(httpRequest.body)
    })

    it("should return statusCode 400 when request has no body or is not completed", async () => {
        //arrange
        const createUserUseCase = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(createUserUseCase)

        const httpRequest = {}

        //act
        const result = await createUserController.execute(httpRequest)

        //assert
        expect(result.statusCode).toBe(400)
    })

    it("should return statusCode 400 and message on body related to first_name missing", async () => {
        //arrange
        const createUserUseCase = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(createUserUseCase)

        const httpRequest = {
            body: {
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({ length: 7 }),
            },
        }

        //act
        const result = await createUserController.execute(httpRequest)
        //assert
        expect(result.statusCode).toBe(400)
        expect(result.body.message).toBe("first_name required")
    })

    it("should return statusCode 400 and message on body related to last_name missing", async () => {
        //arrange
        const createUserUseCase = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(createUserUseCase)

        const httpRequest = {
            body: {
                first_name: faker.person.firstName(),
                email: faker.internet.email(),
                password: faker.internet.password({ length: 7 }),
            },
        }

        //act
        const result = await createUserController.execute(httpRequest)

        //assert
        expect(result.statusCode).toBe(400)
        expect(result.body.message).toBe("last_name required")
    })

    it("should return statusCode 400 and message on body related to email missing", async () => {
        //arrange
        const createUserUseCase = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(createUserUseCase)

        const httpRequest = {
            body: {
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                password: faker.internet.password({ length: 7 }),
            },
        }

        //act
        const result = await createUserController.execute(httpRequest)

        //assert
        expect(result.statusCode).toBe(400)
        expect(result.body.message).toBe("E-mail required")
    })

    it("should return statusCode 400 and message on body related to email on wrong format", async () => {
        //arrange
        const createUserUseCase = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(createUserUseCase)

        const httpRequest = {
            body: {
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: "invalid_email",
                password: faker.internet.password({ length: 7 }),
            },
        }

        //act
        const result = await createUserController.execute(httpRequest)

        //assert
        expect(result.statusCode).toBe(400)
        expect(result.body.message).toBe("Provide a valid e-mail")
    })

    it("should return statusCode 400 and message on body related to password missing", async () => {
        //arrange
        const createUserUseCase = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(createUserUseCase)

        const httpRequest = {
            body: {
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
            },
        }

        //act
        const result = await createUserController.execute(httpRequest)

        //assert
        expect(result.statusCode).toBe(400)
        expect(result.body.message).toBe("Password required")
    })

    it("should return statusCode 400 and message on body related to password with less than 6 characters", async () => {
        //arrange
        const createUserUseCase = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(createUserUseCase)

        const httpRequest = {
            body: {
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({ length: 3 }),
            },
        }

        //act
        const result = await createUserController.execute(httpRequest)

        //assert
        expect(result.statusCode).toBe(400)
        expect(result.body.message).toBe(
            "Password must have at least 6 characters",
        )
    })

    it("should call CreateUserUseCase with correct params", async () => {
        //arrange
        const createUserUseCase = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(createUserUseCase)

        const httpRequest = {
            body: {
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({ length: 7 }),
            },
        }

        const executeSpy = jest.spyOn(createUserUseCase, "execute")

        //act
        await createUserController.execute(httpRequest)
        //assert
        expect(executeSpy).toHaveBeenCalledWith(httpRequest.body)
        expect(executeSpy).toHaveBeenCalledTimes(1)
    })

    it("should return 500 if CreateUserUseCase throws ", async () => {
        //arrange
        const createUserUseCase = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(createUserUseCase)

        const httpRequest = {
            body: {
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({ length: 7 }),
            },
        }
        //act
        jest.spyOn(createUserUseCase, "execute").mockImplementationOnce(() => {
            throw new Error()
        })

        const result = await createUserController.execute(httpRequest)

        //assert
        expect(result.statusCode).toBe(500)
    })

    it("Should return statusCode 400 if CreateUserUseCase throws EmailIsAlreadyInUseError  ", async () => {
        //arrange
        const createUserUseCase = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(createUserUseCase)

        const httpRequest = {
            body: {
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({ length: 7 }),
            },
        }
        //act
        jest.spyOn(createUserUseCase, "execute").mockImplementationOnce(() => {
            throw new EmailAlreadyInUseError(httpRequest.body.email)
        })

        const result = await createUserController.execute(httpRequest)

        //assert
        expect(result.statusCode).toBe(400)
    })
})
