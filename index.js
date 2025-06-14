//procure importar o dotenv primeiro e com o seguinte formato quando estiver trabalhando com ESModule ao invés do CommonJS
import "dotenv/config.js"
import express from "express"

import { PostgresHelper } from "./src/db/postgres/helper.js"

const app = express()

app.get("/", async (req, res) => {
    const result = await PostgresHelper.query("SELECT * FROM users;")

    res.send(JSON.stringify(result))
})

app.listen(3000, () => console.log("Listening on port 3000"))
