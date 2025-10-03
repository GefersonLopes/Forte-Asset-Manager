# Forte Asset Manager — Backend (NestJS + Prisma + PostgreSQL)

API RESTful de **gestão de ativos de TI** (notebooks, monitores, celulares) associados a funcionários de empresas.  
Projeto escrito 100% em **TypeScript**, com **NestJS**, **Prisma**, **PostgreSQL**, **Docker**, testes **Jest**, validações com **class-validator** e documentação **Swagger**.

> Arquitetura **CSR** (Controller → Service → Repository), com **Services nunca acessando o Prisma diretamente**. Regras de negócio concentradas nos services; acesso a banco encapsulado em repositories.

---

## ✨ Principais funcionalidades
- **Companies**: CRUD completo (`id`, `name`, `cnpj` único)
- **Employees**: CRUD completo (`id`, `name`, `email` único, `cpf` único, `companyId` fk)
- **Assets**: CRUD completo (`id`, `name`, `type`, `status`, `employeeId?` fk)
  - Filtros de listagem por `type` e `status` + paginação
  - **Assign/Unassign** de ativos:
    - `POST /assets/:id/assign` → só quando status = **Disponível**; ao associar vira **Em Uso**
    - `POST /assets/:id/unassign` → volta a **Disponível** e `employeeId = null`
    - **Regra de negócio crucial**: um funcionário pode ter **no máximo 1 "Notebook"** em uso. Violação → **409**
- **Listagens adicionais**:
  - `GET /employees?companyId=...` → funcionários por empresa (paginado)
  - `GET /employees/:id/assets` → ativos de um funcionário

---

## 🧱 Stacks & libs
- **Node 20+**, **TypeScript**
- **NestJS 10**
- **Prisma ORM** + **PostgreSQL**
- **Docker / docker-compose** (banco de dados)
- **class-validator / class-transformer** (DTOs)
- **Swagger (OpenAPI)** em `/api`
- **Jest** (testes unitários de *services* com mocks de repositories)
- **ESLint + Prettier + Husky** (pre-commit: lint + test)

---

## 🏗️ Arquitetura (CSR)
- **Controllers**: lidam com HTTP/DTO/validações. **Sem regra de negócio**.
- **Services**: regras de negócio e orquestração. **Nunca** acessam o Prisma.
- **Repositories**: **único** acesso ao PrismaClient. Camada substituível via **tokens** de DI.

---

## 📁 Estrutura de Pastas (principal)

A estrutura abaixo reflete o que está no repositório (conforme seu screenshot):

```
backend/
├─ .husky/
├─ dist/
├─ generated/
├─ node_modules/
├─ prisma/
│  ├─ migrations/
│  │  └─ 20251002220458_init/           # migração inicial gerada
│  └─ schema.prisma
├─ src/
│  ├─ database/
│  │  ├─ database.module.ts
│  │  └─ prisma.service.ts
│  ├─ health/
│  │  ├─ health.controller.ts
│  │  └─ health.module.ts
│  ├─ modules/
│  │  ├─ assets/
│  │  │  ├─ dto/
│  │  │  │  ├─ create-asset.dto.ts
│  │  │  │  └─ update-asset.dto.ts
│  │  │  ├─ repositories/
│  │  │  │  ├─ assets.repository.ts
│  │  │  │  └─ prisma-assets.repository.ts
│  │  │  ├─ assets.controller.ts
│  │  │  ├─ assets.module.ts
│  │  │  └─ assets.service.ts
│  │  ├─ companies/
│  │  └─ employees/
│  ├─ tests/
│  │  ├─ assets.service.spec.ts
│  │  ├─ companies.service.spec.ts
│  │  └─ employees.service.spec.ts
│  ├─ shared/
│  │  ├─ constants/
│  │  │  └─ tokens.ts
│  │  └─ dto/
│  │     ├─ pagination.dto.ts
│  │     └─ response.dto.ts
│  ├─ app.module.ts
│  └─ main.ts
├─ test/
├─ .env
├─ .env.example
├─ docker-compose.yml
├─ Dockerfile
├─ eslint.config.mjs
├─ .prettierrc
├─ ...
├─ forte-asset-manager-postman # Arquivo de coleção com todos os endpoints para uso no postman 
└─ README.md
```

> Observação: se `companies` e `employees` ainda não aparecem no screenshot acima, eles existem no projeto de exemplo e devem seguir a mesma organização de **assets** (dto, repositories, controller, service, module).

---

## ⚙️ Variáveis de ambiente

Crie o arquivo `.env` (ou copie `.env.example`), com a string de conexão do Postgres:

```env
# .env
DATABASE_URL="postgresql://forte:forte@localhost:5432/forte_asset_manager?schema=public"
```

> Os valores acima batem com o `docker-compose.yml` (user: `forte`, pass: `forte`, db: `forte_asset_manager`).

---

## 🐳 Subindo com Docker (PostgreSQL)

**Subir o banco**
   ```bash
    docker compose up -d db
    docker compose run --rm api sh -c "npx prisma migrate dev --name init"
    docker compose up -d api
   ```


## 🐳 Subindo com NodeJS

1. **Instalar as dependências**
   ```bash
   npm i
   ```

2. **Gerar o Prisma Client**
   ```bash
   npx prisma generate
   ```

3. **Aplicar a migração inicial** (usa as migrações de `prisma/migrations`):
   - Ambiente dev (cria/ajusta o schema e mantém histórico):
     ```bash
     npx prisma migrate dev --name init
     ```
   - Ambiente prod (só aplica migrações já existentes):
     ```bash
     npx prisma migrate deploy
     ```

4. **Rodar o servidor em dev**
   ```bash
   npm run start:dev
   ```
   - App: `http://localhost:3000`
   - Swagger: `http://localhost:3000/api`
   - Health: `http://localhost:3000/health`

> Dica: Se preferir, crie *seeds* depois (ex.: `npx prisma db seed`).

---

## ▶️ Scripts NPM úteis

```bash
npm run start          # inicia buildado (dist)
npm run start:dev      # NestJS em watch mode
npm run build          # compila TypeScript -> dist
npm run lint           # ESLint
npm run test           # Jest (unit tests)
npm run prisma:generate
npm run prisma:migrate # atalho (se configurado no package.json)
```

---

## 🔐 Validações e DTOs
- DTOs com `class-validator` + `class-transformer` (ex.: `PaginationDto`, `Create*Dto`, `Update*Dto`).
- `ValidationPipe` global com `whitelist`, `transform` e `forbidNonWhitelisted` habilitados (vide `main.ts`).

---

## 🧪 Testes
- **Jest** configurado com testes unitários dos **services** usando **mocks** dos repositories.
- Executar:
  ```bash
  npm test
  ```

---

## 📜 Swagger
- A documentação OpenAPI é gerada via `@nestjs/swagger` e exposta em:
  - `http://localhost:3000/api`

---

## 🚦 Husky (Qualidade no commit)
- Hook de **pre-commit** roda `npm run lint` e `npm test`.
- Ative após instalar dependências:
  ```bash
  npx husky install
  ```

---

## 🔌 Endpoints (resumo)
- **Companies**: `POST /companies`, `GET /companies`, `GET /companies/:id`, `PATCH /companies/:id`, `DELETE /companies/:id`
- **Employees**: `POST /employees`, `GET /employees`, `GET /employees/:id`, `PATCH /employees/:id`, `DELETE /employees/:id`, `GET /employees/:id/assets`
- **Assets**: `POST /assets`, `GET /assets`, `GET /assets/:id`, `PATCH /assets/:id`, `DELETE /assets/:id`, `POST /assets/:id/assign`, `POST /assets/:id/unassign`
- **Health**: `GET /health`

### Regras de negócio chave
- `assign`: só permitido quando o asset está **"Disponível"** → senão **422**.
- Ao associar: `status` muda para **"Em Uso"** e `employeeId` é definido.
- **Máximo 1 "Notebook"** por funcionário em uso → violar retorna **409**.
- `unassign`: `status` volta a **"Disponível"** e `employeeId = null`.

---

## 🧰 Troubleshooting

- **Erro de conexão com o banco**: confirme `docker compose ps`, porta `5432` livre, e `DATABASE_URL` correta.
- **Prisma Client não gerado**: rode `npx prisma generate` após `npm i`.
- **Conflitos de porta**: altere a porta do Postgres no `docker-compose.yml` e ajuste a `DATABASE_URL`.
- **Migração inicial**: se a tabela não existe, rode `npx prisma migrate dev --name init` (dev) ou `npx prisma migrate deploy` (prod).

---

## 📄 Licença
MIT — use à vontade. :)

---

## 🗺️ Referências rápidas
- NestJS: https://docs.nestjs.com/
- Prisma: https://www.prisma.io/docs
- Swagger (Nest): https://docs.nestjs.com/openapi/introduction
