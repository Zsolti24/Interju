# Mini Food Ordering System

Fullstack food ordering app: NestJS backend, Next.js frontend, PostgreSQL via Prisma.

## Prerequisites

- Node.js 22+
- Docker (for PostgreSQL)

## Database setup

Start a local PostgreSQL instance:

```
docker compose up -d db
```

Apply the migrations:

```
cd backend
npx prisma migrate dev
```

Seed the database with sample restaurants and menu items:

```
npx prisma db seed
```

## Backend

```
cd backend
npm install
cp .env.example .env
npm run start:dev
```

Runs at `http://localhost:3001`.

- API base URL: `http://localhost:3001`
- Swagger docs: `http://localhost:3001/api`

## Frontend

```
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

Runs at `http://localhost:3000`.
