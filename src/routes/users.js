import {
    CreateUserController,
    GetUserByIdController,
    UpdateUserController,
    DeleteUserController,
    GetUserBalanceController,
    LoginUserController,
} from "../controllers/index.js"

import {
    GetUserByIdUseCase,
    CreateUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    GetUserBalanceUseCase,
    LoginUserUseCase,
} from "../use-cases/index.js"

import {
    PostgresCreateUserRepository,
    PostgresDeleteUserRepository,
    PostgresGetUserByIdRepository,
    PostgresGetUserByEmailRepository,
    PostgresUpdateUserRepository,
    PostgresGetUserBalanceRepository,
} from "../repositories/postgres/index.js"

import {
    PasswordHasherAdapter,
    IdGeneratorAdapter,
    PasswordComparatorAdapter,
    TokensGeneratorAdapter,
} from "../adapters/index.js"

import { Router } from "express"

export const usersRouter = Router()

usersRouter.post("/api/users", async (request, response) => {
    const getUserByEmailRepository = new PostgresGetUserByEmailRepository()
    const createUserRepository = new PostgresCreateUserRepository()
    const passwordHasherAdapter = new PasswordHasherAdapter()
    const idGeneratorAdapter = new IdGeneratorAdapter()
    const createUserUseCase = new CreateUserUseCase(
        getUserByEmailRepository,
        createUserRepository,
        passwordHasherAdapter,
        idGeneratorAdapter,
    )
    const createUserController = new CreateUserController(createUserUseCase)
    const { statusCode, body } = await createUserController.execute(request)

    return response.status(statusCode).json(body)
})

usersRouter.get("/api/users/:userId", async (request, response) => {
    const getUserByIdRepository = new PostgresGetUserByIdRepository()
    const getUserbyIdUseCase = new GetUserByIdUseCase(getUserByIdRepository)
    const getUserByIdController = new GetUserByIdController(getUserbyIdUseCase)

    const { statusCode, body } = await getUserByIdController.execute(request)

    return response.status(statusCode).json(body)
})

usersRouter.patch("/api/users/:userId", async (request, response) => {
    const getUserByEmailRepository = new PostgresGetUserByEmailRepository()
    const updateUserRepository = new PostgresUpdateUserRepository()
    const passwordHasherAdapter = new PasswordHasherAdapter()
    const updateUserUseCase = new UpdateUserUseCase(
        updateUserRepository,
        getUserByEmailRepository,
        passwordHasherAdapter,
    )
    const updateUserController = new UpdateUserController(updateUserUseCase)

    const { statusCode, body } = await updateUserController.execute(request)

    return response.status(statusCode).json(body)
})

usersRouter.delete("/api/users/:userId", async (request, response) => {
    const deleteUserRepository = new PostgresDeleteUserRepository()
    const deleteUserUseCase = new DeleteUserUseCase(deleteUserRepository)
    const deleteUserController = new DeleteUserController(deleteUserUseCase)

    const { statusCode, body } = await deleteUserController.execute(request)

    return response.status(statusCode).json(body)
})

usersRouter.get("/api/users/:userId/balance", async (request, response) => {
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

usersRouter.post("/api/users/login", async (request, response) => {
    const getUserByEmailRepository = new PostgresGetUserByEmailRepository()
    const passwordComparatorAdapter = new PasswordComparatorAdapter()
    const tokensGeneratorAdapter = new TokensGeneratorAdapter()
    const loginUserUseCase = new LoginUserUseCase(
        getUserByEmailRepository,
        passwordComparatorAdapter,
        tokensGeneratorAdapter,
    )
    const loginUserController = new LoginUserController(loginUserUseCase)

    const { statusCode, body } = await loginUserController.execute(request)

    return response.status(statusCode).json(body)
})
