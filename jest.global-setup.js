import { execSync } from "child_process"

function waitForPostgres() {
    let ready = false
    let attempts = 0
    while (!ready && attempts < 10) {
        try {
            execSync(
                "docker exec finance-app-pg-test pg_isready -U root -d finance-app",
            )
            ready = true
        } catch (e) {
            attempts++
            console.log("Waiting for postgres-test to be ready..." + e)
            execSync("sleep 2")
        }
    }
}

export default async function () {
    // Use this in caso receba erro de user_balance_view faltando
    execSync("docker compose down postgres-test") // Remove volumes, apaga o banco
    execSync("docker compose up -d --wait postgres-test")
    waitForPostgres()
    execSync("npx prisma migrate deploy")
}
