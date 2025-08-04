import {
    CreateTransactionController,
    GetTransactionsByUserIdController,
    UpdateTransactionController,
    DeleteTransactionController,
} from "../controllers/index.js"
import {
    PostgresCreateTransactionRepository,
    PostgresGetTransactionsByUserIdRepository,
    PostgresUpdateTransactionRepository,
    PostgresDeleteTransactionRepository,
    PostgresGetUserByIdRepository,
} from "../repositories/postgres/index.js"
import {
    CreateTransactionUseCase,
    GetTransactionsByUserIdUseCase,
    UpdateTransactionUseCase,
    DeleteTransactionUseCase,
} from "../use-cases/index.js"

import { IdGeneratorAdapter } from "../adapters/index.js"

import { Router } from "express"

export const transactionsRouter = Router()

transactionsRouter.post("/api/transactions", async (request, response) => {
    const createTransactionRepository =
        new PostgresCreateTransactionRepository()
    const getUserByIdRepository = new PostgresGetUserByIdRepository()
    const idGeneratorAdapter = new IdGeneratorAdapter()
    const createTransactionUseCase = new CreateTransactionUseCase(
        createTransactionRepository,
        getUserByIdRepository,
        idGeneratorAdapter,
    )
    const createTransactionController = new CreateTransactionController(
        createTransactionUseCase,
    )
    const { statusCode, body } =
        await createTransactionController.execute(request)

    return response.status(statusCode).json(body)
})

transactionsRouter.get("/api/transactions", async (request, response) => {
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

transactionsRouter.patch(
    "/api/transactions/:transactionId",
    async (request, response) => {
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
    },
)

transactionsRouter.delete(
    "/api/transactions/:transactionId",
    async (request, response) => {
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
    },
)
