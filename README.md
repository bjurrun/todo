# todo

Productivity app.

## Run locally

1. Copy the env file.

```bash
cp .env.example .env
```

2. Start PostgreSQL.

```bash
docker compose up -d
```

3. Install dependencies.

```bash
npm install
```

4. Generate Prisma client + run migrations + seed demo data.

```bash
npx prisma generate
npx prisma migrate dev
npx prisma db seed
```

## Seed data

The seed creates:
- 1 demo user (`demo@todo.local`)
- 10 tasks
- 5 tags
- Task/tag relationships
