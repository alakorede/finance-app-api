import { CreateUserController } from "../../../src/controllers/user/create-user.js"

describe("Create User Controller", () => {
    //stub
    class CreateUserUseCaseStub {
        execute(user) {
            return user
        }
    }

    test("should return user data on body when created succesfully", async () => {
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

    test("should return statusCode 200 when a user is created succesfully", async () => {
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

    test("should return statusCode 400 when request has no body or is not completed", async () => {
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

    //adicionar validação de todos os possíveis erros e retornos falhos nesse arquivo
})
