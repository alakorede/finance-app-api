import { execSync } from "child_process"

module.exports = async function () {
    //Use this in case to receive errors about user_balance_view missing
    execSync("docker-compose down postgres-test") // Remove volumes, apaga o banco
    execSync("docker-compose up -d --wait postgres-test")
    execSync("npx prisma migrate deploy")
}
