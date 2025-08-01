-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('EARNING', 'EXPENSE', 'INVESTMENT');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "first_name" VARCHAR(50) NOT NULL,
    "last_name" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(100) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "date" DATE NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "type" "TransactionType" NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


-- Create the view
CREATE VIEW user_balance_view AS
SELECT
	user_id,
	SUM(CASE WHEN type = 'EARNING' THEN amount ELSE 0 END) AS earnings,
	SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END) AS expenses,
	SUM(CASE WHEN type = 'INVESTMENT' THEN amount ELSE 0 END) AS investments,
	SUM(CASE WHEN type = 'EARNING' THEN amount ELSE 0 END)
		- SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END)
		- SUM(CASE WHEN type = 'INVESTMENT' THEN amount ELSE 0 END) AS balance
FROM "Transaction"
GROUP BY user_id;