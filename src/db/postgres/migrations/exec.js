import "dotenv/config.js"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { pool } from "../helper.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const execMigrations = async () => {
    const client = await pool.connect()
    try {
        const filePath = path.join(__dirname, "01-init.sql")
        const script = fs.readFileSync(filePath, "utf-8")
        console.log(filePath)
        await client.query(script)
        console.log("Migrations executed successfully")
    } catch (e) {
        console.error(e)
    } finally {
        await client.release()
    }
}

execMigrations()
