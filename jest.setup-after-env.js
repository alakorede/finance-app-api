import { prisma } from "./prisma/prisma"

beforeEach(async () => {
    // await prisma.$queryRawUnsafe(
    //     `TRUNCATE TABLE user_balance_view RESTART IDENTITY CASCADE;`
    // )
    await prisma.transaction.deleteMany({})
    await prisma.user.deleteMany({})
})
