//procure importar o dotenv primeiro e com o seguinte formato quando estiver trabalhando com ESModule ao invés do CommonJS
//Isso garante que ele é importado antes de tudo e que a configuração dele é feita antes de tudo,
// garantindo que o acesso do process.env esteja disponível pra todo o dódigo
import "dotenv/config.js"
import express from "express"

const app = express()
app.use(express.json())

console.log(process.env)
app.listen(process.env.API_PORT, () =>
    console.log(`Listening on port ${process.env.API_PORT}`),
)
