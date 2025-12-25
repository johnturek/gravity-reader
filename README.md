
# Gravity Reader

A premium RSS reader with Read-It-Later functionality, built with Next.js, Tailwind CSS, Prisma, and Auth.js (Passkeys).

## Features
- **RSS Aggregation**: Subscribe to any RSS, Atom, or JSON feed.
- **Auto Detection**: Automatically finds feed URLs from homepage links.
- **Read It Later**: Save articles to your personal inbox.
- **Reader View**: Distraction-free reading experience using Mozilla Readability.
- **Passkey Auth**: Secure, passwordless login with WebAuthn.
- **Dark Mode**: Premium glassmorphism UI.

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Setup Database (SQLite):
   ```bash
   npx prisma db push
   ```

3. Run the server:
   ```bash
   npm run dev
   ```

## Deployment (Vercel)

This app is optimized for Vercel.

### 1. Database
You need a Postgres database (Vercel Postgres is free).
Update `prisma/schema.prisma` before deploying:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 2. Environment Variables
Set these in your Vercel Project Settings:
- `DATABASE_URL`: Your Postgres connection string.
- `AUTH_SECRET`: Generate one with `npx auth secret`.
- `NEXTAUTH_URL`: (Optional on Vercel) Your deployment URL.

### 3. Build Command
Vercel should automatically detect Next.js.
The build command `npm run build` will automatically run `prisma generate` (configured in `package.json`).
