//procure importar o dotenv primeiro e com o seguinte formato quando estiver trabalhando com ESModule ao invés do CommonJS
//Isso garante que ele é importado antes de tudo e que a configuração dele é feita antes de tudo,
// garantindo que o acesso do process.env esteja disponível pra todo o dódigo
import "dotenv/config.js"
import express from "express"
import { CreateUserController } from "./src/controllers/create-user.js"
import { GetUserByIdController } from "./src/controllers/get-user-by-id.js"
import { UpdateUserController } from "./src/controllers/update-use.js"

const app = express()
app.use(express.json())

app.post("/api/users", async (request, response) => {
    const createUserController = new CreateUserController()
    const { statusCode, body } = await createUserController.execute(request)

    return response.status(statusCode).json(body)
})

app.get("/api/users/:userId", async (request, response) => {
    const getUserByIdController = new GetUserByIdController()
    const { statusCode, body } = await getUserByIdController.execute(request)

    return response.status(statusCode).json(body)
})

app.patch("/api/users/:userId", async (request, response) => {
    const updateUserController = new UpdateUserController()
    const { statusCode, body } = await updateUserController.execute(request)

    return response.status(statusCode).json(body)
})

app.listen(process.env.API_PORT, () =>
    console.log(`Listening on port ${process.env.API_PORT}`),
)
