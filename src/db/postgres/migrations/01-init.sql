CREATE TABLE IF NOT EXISTS users(
    ID UUID PRIMARY KEY,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL
);

-- CREATE TYPE transactionType AS ENUM ('EARNING', 'EXPENSE', 'INVESTMENT');

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 from pg_type WHERE typname = 'transactiontype') THEN
        CREATE TYPE transactionType AS ENUM ('EARNING', 'EXPENSE', 'INVESTMENT');
    END IF;
END$$;

CREATE TABLE IF NOT EXISTS transactions(
    ID UUID PRIMARY KEY,
    userId UUID REFERENCES users(ID) ON DELETE CASCADE NOT NULL,
    name VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    type transactionType NOT NULL
);