import { execSync } from "child_process"

module.exports = async function () {
    execSync("docker-compose up -d --wait postgres-test")
    execSync("npx prisma db push")
}
