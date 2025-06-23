//procure importar o dotenv primeiro e com o seguinte formato quando estiver trabalhando com ESModule ao invés do CommonJS
//Isso garante que ele é importado antes de tudo e que a configuração dele é feita antes de tudo,
// garantindo que o acesso do process.env esteja disponível pra todo o dódigo
import "dotenv/config.js"
import express from "express"
import {
    CreateUserController,
    GetUserByIdController,
    UpdateUserController,
    DeleteUserController,
    CreateTransactionController,
    GetTransactionsByUserIdController,
    UpdateTransactionController,
    DeleteTransactionController,
    GetUserBalanceController,
} from "./src/controllers/index.js"
import {
    PostgresCreateUserRepository,
    PostgresDeleteUserRepository,
    PostgresGetUserByIdRepository,
    PostgresUpdateUserRepository,
    PostgresCreateTransactionRepository,
    PostgresGetTransactionsByUserIdRepository,
    PostgresUpdateTransactionRepository,
    PostgresDeleteTransactionRepository,
    PostgresGetUserBalanceRepository,
} from "./src/repositories/postgres/index.js"
import {
    GetUserByIdUseCase,
    CreateUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    CreateTransactionUseCase,
    GetTransactionsByUserIdUseCase,
    UpdateTransactionUseCase,
    DeleteTransactionUseCase,
    GetUserBalanceUseCase,
} from "./src/use-cases/index.js"
const app = express()
app.use(express.json())

// = = = = = = = = = = = = Users = = = = = = = = = = = =
app.post("/api/users", async (request, response) => {
    const createUserRepository = new PostgresCreateUserRepository()
    const createUserUseCase = new CreateUserUseCase(createUserRepository)
    const createUserController = new CreateUserController(createUserUseCase)

    const { statusCode, body } = await createUserController.execute(request)

    return response.status(statusCode).json(body)
})

app.get("/api/users/:userId", async (request, response) => {
    const getUserByIdRepository = new PostgresGetUserByIdRepository()
    const getUserbyIdUseCase = new GetUserByIdUseCase(getUserByIdRepository)
    const getUserByIdController = new GetUserByIdController(getUserbyIdUseCase)

    const { statusCode, body } = await getUserByIdController.execute(request)

    return response.status(statusCode).json(body)
})

app.patch("/api/users/:userId", async (request, response) => {
    const updateUserRepository = new PostgresUpdateUserRepository()
    const updateUserUseCase = new UpdateUserUseCase(updateUserRepository)
    const updateUserController = new UpdateUserController(updateUserUseCase)

    const { statusCode, body } = await updateUserController.execute(request)

    return response.status(statusCode).json(body)
})

app.delete("/api/users/:userId", async (request, response) => {
    const deleteUserRepository = new PostgresDeleteUserRepository()
    const deleteUserUseCase = new DeleteUserUseCase(deleteUserRepository)
    const deleteUserController = new DeleteUserController(deleteUserUseCase)

    const { statusCode, body } = await deleteUserController.execute(request)

    return response.status(statusCode).json(body)
})

app.get("/api/users/:userId/balance", async (request, response) => {
    const getUserBalanceRepository = new PostgresGetUserBalanceRepository()
    const getUserByIdRepository = new PostgresGetUserByIdRepository()
    const getUserBalanceUseCase = new GetUserBalanceUseCase(
        getUserBalanceRepository,
        getUserByIdRepository,
    )
    const getUserBalanceController = new GetUserBalanceController(
        getUserBalanceUseCase,
    )

    const { statusCode, body } = await getUserBalanceController.execute(request)

    return response.status(statusCode).json(body)
})

// = = = = = = = = = = = Transactions = = = = = = = = = = = =
app.post("/api/transactions", async (request, response) => {
    const createTransactionRepository =
        new PostgresCreateTransactionRepository()
    const getUserByIdRepository = new PostgresGetUserByIdRepository()
    const createTransactionUseCase = new CreateTransactionUseCase(
        createTransactionRepository,
        getUserByIdRepository,
    )
    const createTransactionController = new CreateTransactionController(
        createTransactionUseCase,
    )
    const { statusCode, body } =
        await createTransactionController.execute(request)

    return response.status(statusCode).json(body)
})

app.get("/api/transactions", async (request, response) => {
    const getTransactionsByUserIdRepository =
        new PostgresGetTransactionsByUserIdRepository()
    const getUserByIdRepository = new PostgresGetUserByIdRepository()
    const getTransactionsByUserIdUseCase = new GetTransactionsByUserIdUseCase(
        getTransactionsByUserIdRepository,
        getUserByIdRepository,
    )
    const getTransactionsByUserIdController =
        new GetTransactionsByUserIdController(getTransactionsByUserIdUseCase)

    const { statusCode, body } =
        await getTransactionsByUserIdController.execute(request)

    return response.status(statusCode).json(body)
})

app.patch("/api/transactions/:transactionId", async (request, response) => {
    const updateTransactionRepository =
        new PostgresUpdateTransactionRepository()
    const updateTransactionUseCase = new UpdateTransactionUseCase(
        updateTransactionRepository,
    )
    const updateTransactionController = new UpdateTransactionController(
        updateTransactionUseCase,
    )

    const { statusCode, body } =
        await updateTransactionController.execute(request)

    return response.status(statusCode).json(body)
})

app.delete("/api/transactions/:transactionId", async (request, response) => {
    const deleteTransactionRepository =
        new PostgresDeleteTransactionRepository()
    const deleteTransactionUseCase = new DeleteTransactionUseCase(
        deleteTransactionRepository,
    )
    const deleteTransactionController = new DeleteTransactionController(
        deleteTransactionUseCase,
    )

    const { statusCode, body } =
        await deleteTransactionController.execute(request)

    return response.status(statusCode).json(body)
})

app.listen(process.env.API_PORT, () =>
    console.log(`Listening on port ${process.env.API_PORT}`),
)
