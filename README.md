# Jobs Portal (Bilingual AR/EN)

Production-ready Next.js jobs portal with Arabic/English support, RTL, public jobs listing/details, and admin dashboard CRUD.

## Features
- `/jobs`: cards, search, filters (category/location/type), pagination.
- `/jobs/:slug`: public job details page.
- Language toggle (Arabic/English) with RTL for Arabic.
- External apply links only.
- `/admin`: login + CRUD jobs, categories, locations, publish/unpublish.
- SQLite + Prisma persistence.
- Seeded sample data.
- Docker + Dokploy-friendly deployment.

## Tech Stack
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Prisma + SQLite
- Simple admin auth via env username/password + signed cookie

## Environment Variables
Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Required values:
- `DATABASE_URL` (SQLite path)
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`

## Local Run
```bash
npm install
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```
Open: `http://localhost:3000/jobs`

Admin: `http://localhost:3000/admin`

## Quality Checks
```bash
npm run test
npm run lint
npm run build
```

## Docker
```bash
docker compose up --build -d
```

The container auto-runs `prisma db push` before app start.

## Dokploy Deployment Steps (Exact)
1. Push this folder to a Git repository.
2. In Dokploy, create a **New Application** from that repository.
3. Select **Dockerfile deployment**.
4. Set build context to repository root (`/`).
5. Set environment variables in Dokploy:
   - `DATABASE_URL=file:./prisma/dev.db`
   - `ADMIN_USERNAME=...`
   - `ADMIN_PASSWORD=...`
   - `ADMIN_SESSION_SECRET=...`
6. Expose port **3000**.
7. Deploy.
8. After first deploy, open `/admin` and log in with your env credentials.

> Note: SQLite is file-based; for persistent production storage ensure volume persistence is enabled in Dokploy.

## Notes
- UI is inspired by regional job board style with clean cards/filters, but built from scratch.
- No internal application form is implemented by design.
