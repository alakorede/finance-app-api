import { PostgresHelper } from "../../../db/postgres/helper.js"

export class PostgresUpdateTransactionRepository {
    async execute(transactionId, updateTransactionParams) {
        const updateFields = []
        const updateValues = []

        Object.keys(updateTransactionParams).forEach((key) => {
            updateFields.push(`${key} = $${updateValues.length + 1}`)
            updateValues.push(updateTransactionParams[key])
        })

        const updateQuery = `
            UPDATE transactions
            SET ${updateFields.join(", ")}
            WHERE id = $${transactionId}
            RETURNING *`

        const updatedTransaction = await PostgresHelper.query(
            updateQuery,
            updateValues,
        )

        return updatedTransaction[0]
    }
}
