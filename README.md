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
