# Helpdesk Ticket Maintenance System

A web-based helpdesk ticket system supporting L1–L3 escalation workflow, role-based access control, and activity logging.

## Tech Stack

| Layer    | Technology                                  |
| -------- | ------------------------------------------- |
| Frontend | React 19 (Vite) + TypeScript + Tailwind CSS |
| Backend  | Express.js 5 + TypeScript                   |
| Database | MongoDB 7 (replica set)                     |
| Auth     | JWT (role-based access control)             |
| Testing  | Jest + Testing Library                      |

## Prerequisites

- **Node.js** ≥ 18
- **Docker & Docker Compose** (for MongoDB)

## Getting Started

### 1. Start MongoDB

```bash
docker compose up -d
```

This starts a MongoDB 7 replica set on port `27017`.

### 2. Backend

```bash
cd backend
cp .env.example .env   # then edit values as needed
npm install
npm run dev
```

The API runs at `http://localhost:3000`.

### 3. Frontend

```bash
cd frontend
cp .env.example .env   # then edit values as needed
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

## Environment Variables

### Backend (`backend/.env`)

| Variable       | Description                    | Default                          |
| -------------- | ------------------------------ | -------------------------------- |
| `PORT`         | Server port                    | `3000`                           |
| `MONGODB_URI`  | MongoDB connection string      | see `.env.example`               |
| `JWT_SECRET`   | JWT signing key (min 32 chars) | —                                |
| `JWT_EXPIRES_IN` | Token expiration             | `24h`                            |
| `NODE_ENV`     | Environment                    | `development`                    |
| `WEB_URL`      | Frontend URL (CORS)            | `http://localhost:5173`          |

### Frontend (`frontend/.env`)

| Variable       | Description       | Default                          |
| -------------- | ----------------- | -------------------------------- |
| `VITE_API_URL` | Backend API URL   | `http://localhost:3000/api`      |

## Sample Credentials

Use the **Sign Up** page to create accounts. Select a role during registration:

| Role               | Level | Capabilities                                                              |
| ------------------ | ----- | ------------------------------------------------------------------------- |
| Helpdesk Agent     | L1    | Create tickets, update status, escalate to L2                             |
| Technical Support  | L2    | Assign critical value (C1–C3), update status, escalate to L3 (C1/C2 only) |
| Advanced Support   | L3    | Update status, mark as completed                                          |

Suggested test accounts:

| Email              | Password  | Role |
| ------------------ | --------- | ---- |
| `l1@helpdesk.com`  | `pass123` | L1   |
| `l2@helpdesk.com`  | `pass123` | L2   |
| `l3@helpdesk.com`  | `pass123` | L3   |

## Running Tests

### Backend

```bash
cd backend
npm test
```

### Frontend

```bash
cd frontend
npm test
```

## Ticket Escalation Flow

```
L1: Create Ticket → Attempt Fix → Escalate to L2 if unresolved
L2: Assign Critical Value → Work on Fix → Escalate to L3 if unresolved (C1/C2 only)
L3: Final Fix → Mark as Completed
```

## Project Structure

```
├── docker-compose.yaml
├── backend/
│   └── src/
│       ├── modules/        # auth, tickets, ticketLogs, users, userRoles
│       ├── server/         # Express routes, middleware
│       ├── config/         # env, db
│       └── shared/         # utils, types
└── frontend/
    └── src/
        ├── pages/          # auth, tickets
        ├── services/       # API clients
        ├── store/          # Zustand auth store
        ├── types/          # TypeScript interfaces
        └── router/         # React Router config
```
