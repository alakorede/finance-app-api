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
    PostgresGetTransactionByIdRepository,
} from "../repositories/postgres/index.js"
import {
    CreateTransactionUseCase,
    GetTransactionsByUserIdUseCase,
    UpdateTransactionUseCase,
    DeleteTransactionUseCase,
} from "../use-cases/index.js"

import { IdGeneratorAdapter } from "../adapters/index.js"

import { Router } from "express"
import { auth } from "../middlewares/auth.js"

export const transactionsRouter = Router()

transactionsRouter.post(
    "/api/transactions",
    auth,
    async (request, response) => {
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
        const { statusCode, body } = await createTransactionController.execute({
            ...request,
            body: { ...request.body, user_id: request.userId },
        })

        return response.status(statusCode).json(body)
    },
)

transactionsRouter.get("/api/transactions", auth, async (request, response) => {
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
        await getTransactionsByUserIdController.execute({
            ...request,
            query: {
                ...request.query,
                from: request.query.from,
                to: request.query.to,
                userId: request.userId,
            },
        })

    return response.status(statusCode).json(body)
})

transactionsRouter.patch(
    "/api/transactions/:transactionId",
    auth,
    async (request, response) => {
        const getTransactionByIdRepository =
            new PostgresGetTransactionByIdRepository()
        const updateTransactionRepository =
            new PostgresUpdateTransactionRepository()
        const updateTransactionUseCase = new UpdateTransactionUseCase(
            updateTransactionRepository,
            getTransactionByIdRepository,
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
    auth,
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
