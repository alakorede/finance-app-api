import { PostgresHelper } from "../db/postgres/helper.js"

export class PostgresCreateUserRepository {
    async execute(createUserParams) {
        await PostgresHelper.query(
            "INSERT INTO users (ID, first_name,last_name, email, password) VALUES ($1, $2, $3, $4, $5)",
            [
                createUserParams.id,
                createUserParams.first_name,
                createUserParams.last_name,
                createUserParams.email,
                createUserParams.password,
            ],
        )

        const createdUser = await PostgresHelper.query(
            "SELECT * FROM users WHERE id = $1",
            [createUserParams.id],
        )

        return createdUser[0]
    }
}

// Eu criaria uma estrutura diferente, sem identificar no repository o DB no nome da CommandCompleteMessage,
// simplesmente enviaria a criação do user para o db, assim se eu trocar de DB, por exemplo, n precisarei modificar muita coisa no código

// Eu não criaria essa estrutura de repository e usecase por função como o professor tá fazendo
// Criaria um userRepository e dentro dele adicionaria as funções. Poderia ser só com esport delas ou criação de classes measureMemory, achei interessante desse jeito
// No lugar de use-case eu geralmente utilizo o Service, exercendo a mesma função.

//Minha estrutura de MVC de cima pra baixo é: Routes/Controllers/Services/Repositories/DB  em paralelo aos Services eu crio Utilities ou Helpers
