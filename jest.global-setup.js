import { execSync } from "child_process"

export default async function () {
    // Use this in caso receba erro de user_balance_view faltando
    execSync("docker compose down postgres-test") // Remove volumes, apaga o banco
    execSync("docker compose up -d --wait postgres-test")
    execSync("npx prisma migrate deploy")
}
