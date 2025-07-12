import { CreateUserController } from "../../../src/controllers/user/create-user.js"

describe("Create User Controller", () => {
    //stub
    class CreateUserUseCaseStub {
        execute(user) {
            return user
        }
    }

    it("should return user data on body when created succesfully", async () => {
        //arrange
        const createUserUseCase = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(createUserUseCase)

        const httpRequest = {
            body: {
                first_name: "Luiz",
                last_name: "Moraes",
                email: "luizmoraesim@gmail.com",
                password: "123456789",
            },
        }

        //act
        const result = await createUserController.execute(httpRequest)

        //assert
        expect(result.body).not.toBeNull()
        expect(result.body).not.toBeUndefined()
        expect(result.body).toEqual(httpRequest.body)
    })

    it("should return statusCode 200 when a user is created succesfully", async () => {
        //arrange
        const createUserUseCase = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(createUserUseCase)

        const httpRequest = {
            body: {
                first_name: "Luiz",
                last_name: "Moraes",
                email: "luizmoraesim@gmail.com",
                password: "123456789",
            },
        }

        //act
        const result = await createUserController.execute(httpRequest)

        //assert
        expect(result.statusCode).toBe(200)
    })

    it("should return statusCode 400 when request has no body or is not completed", async () => {
        //arrange
        const createUserUseCase = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(createUserUseCase)

        const httpRequest = {
            body: {
                first_name: "",
                last_name: "",
                email: "",
                password: "",
            },
        }

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
                first_name: "",
                last_name: "Moraes",
                email: "luizmoraesim@gmail.com",
                password: "123456678",
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
                first_name: "Luiz",
                email: "luizmoraesim@gmail.com",
                password: "123456678",
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
                first_name: "Luiz",
                last_name: "Moraes",
                password: "123456678",
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
                first_name: "Luiz",
                last_name: "Moraes",
                email: "wrong mail",
                password: "123456678",
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
                first_name: "Luiz",
                last_name: "Moraes",
                email: "luizmoraesim@gmail.com",
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
                first_name: "Luiz",
                last_name: "Moraes",
                email: "luizmoraesim@gmail.com",
                password: "123",
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
})
