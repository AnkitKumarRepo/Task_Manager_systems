# TaskFlow — Task Management System

A full-stack task management app built with **Node.js + TypeScript** (backend) and **Next.js 14** (frontend).

---

## Project Structure

```
task-management/
├── backend/       # Node.js + Express + Prisma + SQLite
└── frontend/      # Next.js 14 App Router + Tailwind + React Query
```

---

## Quick Start

### 1. Backend

```bash
cd backend

# Install dependencies
npm install

# Copy env and configure
cp .env.example .env

# Generate Prisma client and run migrations
npx prisma generate
npx prisma migrate dev --name init

# Start dev server (runs on http://localhost:5000)
npm run dev
```

### 2. Frontend

```bash
cd frontend

# Install dependencies
npm install

# Copy env
cp .env.local.example .env.local

# Start dev server (runs on http://localhost:3000)
npm run dev
```

---

## API Reference

### Auth

| Method | Endpoint         | Auth | Description              |
|--------|-----------------|------|--------------------------|
| POST   | /auth/register  | No   | Register a new user      |
| POST   | /auth/login     | No   | Login, get tokens        |
| POST   | /auth/refresh   | No   | Refresh access token     |
| POST   | /auth/logout    | Yes  | Invalidate refresh token |
| GET    | /auth/me        | Yes  | Get current user profile |

### Tasks

| Method | Endpoint              | Description                      |
|--------|-----------------------|----------------------------------|
| GET    | /tasks                | List tasks (paginate/filter/search) |
| POST   | /tasks                | Create a task                    |
| GET    | /tasks/:id            | Get task by ID                   |
| PATCH  | /tasks/:id            | Update a task                    |
| DELETE | /tasks/:id            | Delete a task                    |
| PATCH  | /tasks/:id/toggle     | Cycle task status                |

#### GET /tasks query params

| Param    | Type   | Example         |
|----------|--------|-----------------|
| page     | number | `?page=2`       |
| limit    | number | `?limit=10`     |
| status   | string | `?status=PENDING` |
| priority | string | `?priority=HIGH`|
| search   | string | `?search=report`|

---

## Tech Stack

### Backend
- Node.js + TypeScript
- Express.js
- Prisma ORM (SQLite for dev, swap to PostgreSQL for prod)
- JWT (access + refresh tokens)
- bcryptjs (password hashing)
- Zod (request validation)

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- React Query (TanStack Query v5)
- React Hook Form + Zod
- Axios (with auto token-refresh interceptor)
- react-hot-toast

---

## Key Features

- ✅ JWT authentication with silent token refresh
- ✅ Full CRUD for tasks (title, description, status, priority, due date)
- ✅ Pagination, filtering by status/priority, and search
- ✅ Responsive design — works on mobile and desktop
- ✅ Status cycling (Pending → In Progress → Completed → Pending)
- ✅ Overdue task highlighting
- ✅ Toast notifications for all actions

---

## Production Notes

1. **Database** — swap `sqlite` for `postgresql` in `prisma/schema.prisma` and update `DATABASE_URL`
2. **JWT secrets** — use long random strings, never commit real values
3. **CORS** — update `FRONTEND_URL` in backend `.env`
4. **Build**:
   ```bash
   # Backend
   cd backend && npm run build && npm start
   # Frontend
   cd frontend && npm run build && npm start
   ```
