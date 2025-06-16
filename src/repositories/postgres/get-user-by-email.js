import { PostgresHelper } from "../../db/postgres/helper.js"

export class PostgresGetUserByEmailRepository {
    async execute(userEmail) {
        const user = await PostgresHelper.query(
            "SELECT * FROM users WHERE email = $1",
            [userEmail],
        )
        return user[0]
    }
}
