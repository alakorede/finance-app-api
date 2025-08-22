# 💸 Finance App API

Uma API backend robusta para gerenciamento de finanças pessoais, construída com **Node.js**, **Express** e **PostgreSQL** via **Prisma ORM**. Este projeto foi desenvolvido para praticar e dominar conceitos essenciais de backend, incluindo autenticação JWT, validação de dados, arquitetura modular, testes automatizados e integração com banco de dados relacional.

---

## 🚀 Tecnologias & Conceitos

- ✅ **Node.js + Express** — Framework web rápido e minimalista
- ✅ **Prisma ORM** — Integração eficiente com PostgreSQL
- ✅ **JWT** — Autenticação segura com Access e Refresh Tokens
- ✅ **Validação com Zod** — Validação poderosa de dados de entrada
- ✅ **Middlewares customizados** — Autorização, tratamento de erros, etc.
- ✅ **Arquitetura modular** — Separação clara entre controllers, use-cases, repositories e adapters
- ✅ **Swagger** — Documentação interativa da API disponível em `/docs`
- ✅ **Testes automatizados** — Unitários e E2E com Jest e Supertest
- ✅ **Docker** — Ambiente de banco de dados isolado para desenvolvimento e testes
- ✅ **CI/CD** — Pipeline automatizado com GitHub Actions

---

## 📁 Estrutura do Projeto

```
.env
.env.example
.env.test
docker-compose.yml
jest.config.js
package.json
prisma/
src/
    adapters/
    controllers/
    middlewares/
    repositories/
    routes/
    schemas/
    use-cases/
test/
tests-e2e/
docs/
```

---

## 🧪 Como Rodar Localmente

1. **Clone o repositório**

```bash
git clone https://github.com/alakorede/finance-app-api.git
cd finance-app-api
```

2. **Instale as dependências**

```bash
npm install
```

3. **Configure o ambiente**

Crie um arquivo `.env` na raiz do projeto (veja `.env.example` para referência):

```env
POSTGRES_HOST=127.0.0.1
POSTGRES_DATABASE=finance-app
POSTGRES_USER=root
POSTGRES_PASSWORD=password
POSTGRES_PORT=5432
API_PORT=8080
DATABASE_URL=postgresql://root:password@localhost:5432/finance-app?schema=public
JWT_ACCESS_TOKEN_SECRET=seu_access_secret
JWT_REFRESH_TOKEN_SECRET=seu_refresh_secret
```

4. **Suba o banco de dados com Docker**

```bash
docker-compose up -d
```

5. **Execute as migrações do Prisma**

```bash
npx prisma migrate deploy
```

6. **Inicie o servidor**

```bash
npm run dev
```

Acesse a documentação interativa em [http://localhost:8080/docs](http://localhost:8080/docs).

---

## 🔐 Endpoints de Autenticação

- `POST /api/users` — Criação de usuário
- `POST /api/users/login` — Login e geração de tokens JWT
- `POST /api/users/refresh-token` — Gera novos tokens usando o refresh token

## 👤 Endpoints de Usuário

- `GET /api/users/me` — Dados do usuário autenticado
- `PATCH /api/users/me` — Atualiza dados do usuário
- `DELETE /api/users/me` — Remove o usuário
- `GET /api/users/me/balance?from=YYYY-MM-DD&to=YYYY-MM-DD` — Consulta saldo e estatísticas financeiras

## 💰 Endpoints de Transações

- `POST /api/transactions` — Cria uma nova transação (ganho, despesa ou investimento)
- `GET /api/transactions?from=YYYY-MM-DD&to=YYYY-MM-DD` — Lista transações do usuário por período
- `PATCH /api/transactions/:transactionId` — Atualiza uma transação
- `DELETE /api/transactions/:transactionId` — Remove uma transação

---

## 🧪 Testes

- **Unitários:** `npm run test`
- **E2E:** Testes completos em `tests-e2e/` usando Supertest

---

## 🧠 Melhorias Futuras

- Implementar roles e permissões
- Exportação de relatórios financeiros
- Integração com notificações (e-mail, push)
- Melhorias na cobertura de testes
- Deploy automatizado em cloud

---

## 👤 Autor

Feito com 💻 por Luiz Moraes  
[luizmoraesim@gmail.com](mailto:luizmoraesim@gmail.com)  
[github.com/alakorede](https://github.com/alakorede)

---

> Para dúvidas, sugestões ou contribuições, fique à vontade para abrir uma issue ou pull request!
