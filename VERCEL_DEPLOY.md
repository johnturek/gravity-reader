# Deploying to Vercel

This app is set up for Next.js and Vercel.

## Database Setup (Vercel Postgres)

1. Create a new project on Vercel.
2. Add a Storage > Vercel Postgres database.
3. In your project settings, pull the environment variables (`.env.local`).
   - You need `POSTGRES_PRISMA_URL` and `POSTGRES_URL_NON_POOLING`.

## Code Changes

Before deploying, you must switch the Prisma provider from SQLite to PostgreSQL.

1. Open `prisma/schema.prisma`.
2. Change the datasource provider:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("POSTGRES_PRISMA_URL") // Uses connection pooling
  directUrl = env("POSTGRES_URL_NON_POOLING") // Uses direct connection
}
```

3. Commit and push. Vercel will build your app.
4. After deployment, go to Vercel Dashboard > Storage > Vercel Postgres > Data and run the migrations, or locally run:
   
   ```bash
   npx prisma migrate deploy
   ```
   (You need the env vars locally for this).

## Passkeys

WebAuthn requires a valid domain (HTTPS). Vercel provides this automatically.
No extra config needed for Auth.js WebAuthn on Vercel usually, but ensure `NEXTAUTH_URL` is set if needed (Vercel automatically sets `VERCEL_URL` but Auth.js v5 is smart).
Set `AUTH_SECRET` in Vercel Environment Variables (generated via `npx auth secret`).
