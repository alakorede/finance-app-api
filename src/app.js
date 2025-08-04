import express from "express"
import { usersRouter, transactionsRouter } from "./routes/index.js"

export const app = express()
app.use(express.json())

app.use(usersRouter)
app.use(transactionsRouter)
