# TaskFlow

TaskFlow is a full-stack **task management** application built as a take-home assignment. It lets users authenticate, organize work into **projects**, and manage **tasks** with filtering, pagination, and dashboards backed by **project-** and **user-level statistics** APIs.

---

## Features

- **Authentication** — Login and registration with **JWT**-secured sessions  
- **Protected experience** — Route guards and session verification before accessing the app shell  
- **Projects** — Create, read, update, and delete projects  
- **Tasks** — Full CRUD with status, priority, assignee, and due dates  
- **Task filters** — Query tasks by **status**, **priority**, and **assignee** (where supported by the API)  
- **Responsive UI** — Layouts that adapt across viewports, including **mobile bottom navigation**  
- **Project discovery** — **Project selector** via dropdown / popover patterns in the shell  
- **Statistics** — Backend endpoints for **per-project** and **per-user** stats  
- **UX polish** — Loading, empty, and error states; **paginated** lists; **responsive data table** (TanStack Table)

---

## Tech stack

| Layer | Technology |
|--------|------------|
| **Frontend** | React 19, TypeScript, Vite |
| **UI** | shadcn/ui (Radix), Tailwind CSS |
| **Client data** | TanStack Query |
| **Tables** | TanStack Table |
| **Forms / validation** | React Hook Form, Zod |
| **Backend** | Express 5, TypeScript |
| **ORM** | Prisma |
| **Database** | PostgreSQL |
| **Auth** | JWT (Bearer tokens) |
| **Containers** | Docker, Docker Compose |

---

## Folder structure

```text
taskflow-green-tech-zomato/
├── docker-compose.yml          # Postgres + backend + frontend services
├── README.md
├── backend/
│   ├── dockerfile
│   ├── prisma/                 # Schema & migrations
│   └── src/
│       ├── app.ts              # Express app + /api mount
│       ├── index.ts            # HTTP server entry
│       ├── config/             # Env, Prisma client, seed
│       ├── controllers/
│       ├── middlewares/        # Auth, CORS, project access
│       ├── routes/             # v1 routers (auth, projects, tasks)
│       ├── schema/             # Zod request validation
│       ├── services/           # Business logic
│       ├── utils/              # JWT, errors, pagination, responses
│       └── tests/              # Jest tests (see limitations)
├── frontend/
│   ├── dockerfile
│   ├── src/
│   │   ├── components/         # shadcn + shared UI (tables, dialogs, sidebar)
│   │   ├── config/             # Routes, env, query client
│   │   ├── context/
│   │   ├── layouts/            # Main shell, protected layout
│   │   ├── pages/
│   │   ├── schema/             # Zod (aligned with forms)
│   │   ├── services/           # API modules (axios)
│   │   └── ...
│   └── vite.config.ts
```

---

## Setup instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd taskflow-green-tech-zomato
```

### 2. Install dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 3. Environment variables

**Backend** — create `backend/.env` (see `backend/.env` as a reference; do not commit secrets):

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret for signing JWTs |
| `CLIENTS` | Allowed CORS origin(s), e.g. `http://localhost:5173` |

**Frontend** — `frontend/.env`:

| Variable | Purpose |
|----------|---------|
| `VITE_API_URL` | API origin **without** path suffix, e.g. `http://localhost:8000` (the client prepends `/api/v1/`). |

### 4. Database (Prisma)

With Postgres running and `DATABASE_URL` set:

```bash
cd backend
npx prisma generate
npx prisma migrate deploy   # or: npx prisma migrate dev
```

Optional seed (if configured in your branch):

```bash
npm run build && npm run seed
```

### 5. Docker Compose

From the **repository root**:

```bash
docker compose up --build
```

Typical published ports:

| Service | Port |
|---------|------|
| PostgreSQL | `5432` |
| Backend API | `8000` |
| Frontend (Vite) | `5173` |

Compose wires `DATABASE_URL`, `JWT_SECRET`, `CLIENTS`, and `VITE_API_URL` for a reproducible stack.

### 6. Local development (without rebuilding images)

**Terminal 1 — database only (optional):**

```bash
docker compose up db
```

**Terminal 2 — backend:**

```bash
cd backend
npm run dev
```

**Terminal 3 — frontend:**

```bash
cd frontend
npm run dev
```

Backend listens on **port 8000**; the API is mounted at **`/api`**.

---

## API overview

Base URL: **`{origin}/api/v1`**

All authenticated routes expect: `Authorization: Bearer <token>`.

### Auth (`/auth`)

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/auth/login` | Issue JWT |
| `POST` | `/auth/register` | Register user, issue JWT |
| `GET` | `/auth/me` | Current user profile |
| `GET` | `/auth/users` | Users listing (for assignee pickers, etc.) |
| `GET` | `/auth/stats` | **User-wise** aggregate statistics |

### Projects (`/projects`)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/projects` | List projects (pagination query params where implemented) |
| `POST` | `/projects` | Create project |
| `GET` | `/projects/:projectId` | Project detail |
| `PATCH` | `/projects/:projectId` | Update project |
| `DELETE` | `/projects/:projectId` | Delete project |
| `GET` | `/projects/:projectId/users` | Users associated with project (access-controlled) |
| `GET` | `/projects/:projectId/tasks` | List tasks (filters: status, assignee, pagination) |
| `POST` | `/projects/:projectId/tasks` | Create task |
| `GET` | `/projects/:projectId/stats` | **Project-wise** statistics |

### Tasks (`/tasks`)

| Method | Path | Description |
|--------|------|-------------|
| `PATCH` | `/tasks/:id` | Update task |
| `DELETE` | `/tasks/:id` | Delete task |

---

## Architecture decisions & trade-offs

- **Express + TypeScript** — Chosen for a **fast, predictable** server layer with minimal ceremony, strong typing on controllers/services, and straightforward deployment. This prioritized **shipping a complete vertical slice** (auth → projects → tasks → stats) within assignment time.
- **Stability over real-time** — Scope emphasized **reliable CRUD**, validation (Zod), and consistent API responses over WebSockets or live collaboration.
- **Reusable data table** — A **generic TanStack Table** wrapper keeps list views consistent and reduces duplicated column/pagination logic.
- **Mobile-first affordances** — Bottom navigation and responsive layouts favor **usable task flows on small screens**, with progressive enhancement on desktop.

---

## Known limitations & future improvements

- **Automated tests** — Tests are **scaffolded** (`backend/tests/`), but a **Prisma / Jest integration mismatch** was **not fully resolved** under the assignment timeline; CI-quality coverage remains a follow-up.
- **Real-time updates** — **SSE** or a small **WebSocket** channel could refresh tasks and stats without manual refetch.
- **Analytics** — Deeper reporting (burndown, velocity, cohort views) could build on the existing stats endpoints.

---

## Submission notes

- **End-to-end completeness** — The submission optimizes for **clean auth, CRUD, filters, pagination, and stats** working together as a coherent product.
- **Reproducibility** — **Docker Compose** provides a **one-command** environment (database + API + UI) for reviewers.
- **UI quality** — **Responsive** layouts, **loading / empty / error** states, and **accessible** patterns (e.g. dialogs, tables) demonstrate attention to real-world UX.

---

*TaskFlow — take-home full-stack task management assignment.*
