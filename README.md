# Dayflow HRMS

A locally-run Human Resource Management System for attendance, leave, and payroll visibility — built for the "Every workday, perfectly aligned" hackathon problem statement.

![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)
![Express](https://img.shields.io/badge/Express-5-black?logo=express)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-required-336791?logo=postgresql&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-frontend-3178C6?logo=typescript&logoColor=white)

---

## Overview

Dayflow is an HR Management System built around a simple idea: employees check in and out, HR watches the workforce and approves what needs approving, and payroll reflects what actually happened. It was built during a hackathon by a two-person team, with a Next.js/TypeScript frontend and an Express/PostgreSQL backend.

The system separates two roles — **employee** and **HR** — behind JWT-authenticated, role-checked API routes. Employees manage their own attendance, leave requests, and payroll history. HR manages the workforce: approving leave, viewing attendance and payroll across the company, and pulling reports.

Dayflow runs on a local Node.js backend and a local PostgreSQL database. It is not cloud-hosted and does not depend on third-party SaaS services — but it does require a running PostgreSQL instance, so it is not a zero-config or fully offline embedded database like SQLite.

## Problem

Manual HR processes — spreadsheets for attendance, email threads for leave approval, ad-hoc payroll calculation — don't scale even for small teams, and they give HR no live view of who's working, who's on leave, and what payroll currently owes. Employees also have no self-serve way to check their own attendance history or salary breakdown.

## Solution

Dayflow gives employees a dashboard to check in/out, track live worked hours, submit leave requests, and view their payroll history — and gives HR a parallel dashboard with workforce analytics, an approval queue for leave, and consolidated attendance/leave/payroll reports. All actions are backed by a real Postgres database with role-scoped API access, rather than static or mocked data.

## Key Features

### Employee
| Feature | Detail |
|---|---|
| Authentication | Email/password sign-up and sign-in, JWT session token |
| Dashboard | Check-in/check-out control, live elapsed work-time counter |
| Attendance history | Last 7 days of check-in/check-out records with worked hours |
| Leave requests | Submit PAID / SICK / UNPAID requests, view own request history and status |
| Payroll | View own payroll records (base salary, allowances, deductions, net salary) |
| Notifications | Bell/popover feed of personal notifications (payroll processed, leave approved/rejected) |
| Profile | View profile; edit phone/address (organizational fields are HR-only) |

### HR / Admin
| Feature | Detail |
|---|---|
| HR dashboard | Workforce count, today's attendance, pending leave count, attendance rate, total payroll (all pulled from `/api/analytics/hr`) |
| Employee management | List all employees, view/edit individual employee records (department, designation, salary, contact info) |
| Leave approval | View all leave requests, approve or reject with an optional admin comment |
| Payroll visibility | View payroll across all employees, or filtered per employee |
| Reports | Dedicated attendance, leave, and payroll report views with basic aggregates (present/absent counts, pending/approved/rejected counts, total payroll) |
| Notifications | Receives notifications when an employee checks out or submits a leave request |

### Attendance
- Single check-in / check-out per day per employee (enforced by a unique `(employee_id, date)` constraint)
- Worked hours computed server-side from `check_out - check_in` timestamps
- Live duration on the employee dashboard is calculated client-side from the server-recorded check-in time and updates on an interval — this is a client-side timer reading server data, not a push-based real-time stream
- Attendance record marks `payment_status` as `PROCESSED` on checkout

### Leave Management
- Employee submits leave with type, date range, and reason (validated with Zod)
- HR approves or rejects pending requests; both actions notify the employee
- Employees can only view their own requests; HR can view all

### Payroll
- Payroll records store `base_salary`, `allowances`, `deductions`, and `net_salary` per pay period, in INR
- Amounts are formatted with `Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' })` on the frontend
- Payroll rows are seeded/managed data — there is no automatic Basic/HRA/PF salary-component calculator in the current implementation; checkout updates the attendance record's payment status, it does not itself generate a new payroll row

### Notifications
- In-app notification records tied to a user, with type, title, message, and read/unread state
- Created server-side on checkout, leave submission, and leave approval/rejection
- Fetched via polling (`GET /api/notifications`), not a push/WebSocket channel

### Security
- JWT authentication (24-hour expiry) via `jsonwebtoken`
- Passwords hashed with `bcrypt`
- Role-based route guards (`employee` / `hr`) via middleware
- All SQL queries use parameterized placeholders (`$1`, `$2`, …) against `pg` — no string-concatenated queries
- Request body validation with `zod` on auth, leave, and employee-update routes
- Ownership checks on employee profile and leave-record access (an employee cannot read another employee's records)

## Core Workflow

```mermaid
flowchart TD
    A[Employee logs in] --> B[Dashboard]
    B --> C[Check In]
    C --> D[Live elapsed-time counter]
    D --> E[Check Out]
    E --> F[Worked hours calculated<br/>attendance payment_status: PROCESSED]
    F --> G[Notification: Payroll status updated]

    H[HR logs in] --> I[HR Dashboard]
    I --> J[Workforce Analytics]
    I --> K[Attendance Reports]
    I --> L[Leave Approval Queue]
    I --> M[Payroll Visibility]
    I --> N[Reports: Attendance / Leave / Payroll]
    E -.notifies.-> H
```

## Architecture

```mermaid
flowchart TD
    Browser[Browser] --> NextJS[Next.js App Router<br/>frontend]
    NextJS -->|"/api/* rewrite"| Express[Express API<br/>backend:3001]
    Express --> AuthMW[JWT Auth + Role Middleware]
    AuthMW --> Routes[Route Handlers<br/>auth · attendance · leave · payroll<br/>employees · analytics · notifications · reports]
    Routes --> DB[(PostgreSQL)]
```

The frontend calls a relative `/api/*` path; `next.config.mjs` rewrites those requests to the Express server. In production/deployment this rewrite target needs to point at wherever the backend actually runs.

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend framework | Next.js 14 (App Router), React 18, TypeScript | UI, routing, pages |
| Styling | Tailwind CSS, shadcn/ui-style components | Layout and design system |
| Animation | Framer Motion, GSAP | Page/element transitions |
| Custom UI | `FuzzyText`, `TextPressure`, `ClickSpark` (in `components/`) | 404 page effect, interactive text, click-spark interaction |
| Icons | lucide-react | Iconography |
| Backend framework | Node.js, Express 5 | REST API |
| Auth | jsonwebtoken, bcrypt | JWT issuance/verification, password hashing |
| Validation | zod | Request body validation |
| Database | PostgreSQL via `pg` | Persistent storage |
| Env config | dotenv | Environment variable loading |

## Security Architecture

- **Authentication:** email + password sign-in; password checked with `bcrypt.compare`; on success a JWT is issued containing `id`, `email`, `role`, and `employee_id`.
- **Session handling:** stateless — the token is stored client-side (in `localStorage`) and sent as a Bearer token; there is no server-side session store. Sign-out is a client-side token removal.
- **Authorization:** `requireRole('employee' | 'hr')` middleware gates routes; ownership checks (e.g. an employee can only view/edit their own profile or leave requests) are enforced inside individual handlers.
- **SQL injection prevention:** all queries go through parameterized `pg` placeholders — no raw string interpolation into SQL was found in the route handlers.
- **Secrets:** `JWT_SECRET` and `DATABASE_URL` are read from environment variables via `dotenv`; the code falls back to a hardcoded development secret (`super_secret_hackathon_key_do_not_commit_in_real_life`) if `JWT_SECRET` is unset — **this fallback must be overridden with a real secret before any non-local use.**
- **Not implemented:** rate limiting, refresh tokens/token revocation, CSRF protection, and email verification are not present in the current codebase.

## Database Design

PostgreSQL, initialized from `backend/db/schema.sql` on server start (`CREATE TABLE IF NOT EXISTS`, safe to re-run). On first run, if no users exist, the backend seeds three demo accounts (see [Demo Flow](#demo-flow)).

```mermaid
erDiagram
    USERS ||--o| EMPLOYEES : "has profile"
    USERS ||--o{ NOTIFICATIONS : receives
    EMPLOYEES ||--o{ ATTENDANCE : logs
    EMPLOYEES ||--o{ LEAVE_REQUESTS : submits
    EMPLOYEES ||--o{ PAYROLL : has

    USERS {
        int id PK
        text email
        text login_id
        text password_hash
        text role
        timestamp created_at
    }
    EMPLOYEES {
        int id PK
        text employee_id
        int user_id FK
        text name
        text email
        text phone
        text address
        text department
        text designation
        numeric salary
        text role
    }
    ATTENDANCE {
        int id PK
        int employee_id FK
        text date
        timestamp check_in
        timestamp check_out
        text status
        numeric worked_hours
        text payment_status
    }
    LEAVE_REQUESTS {
        int id PK
        int employee_id FK
        text leave_type
        text start_date
        text end_date
        text reason
        text status
        text admin_comment
    }
    PAYROLL {
        int id PK
        int employee_id FK
        text pay_period
        numeric base_salary
        numeric allowances
        numeric deductions
        numeric net_salary
    }
    NOTIFICATIONS {
        int id PK
        int user_id FK
        text type
        text title
        text message
        boolean read
    }
```

## API Overview

Base path: `/api`. All routes below except `signin`/`signup` require `Authorization: Bearer <token>`.

**Auth** (`/api/auth`)
| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/signin` | Public | Log in, receive JWT |
| POST | `/signup` | Public | Create an employee account, auto-generates a login ID |
| POST | `/signout` | Authenticated | No-op confirmation (client discards token) |
| GET | `/me` | Authenticated | Current user + employee profile |

**Attendance** (`/api/attendance`)
| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/check-in` | Employee | Record today's check-in |
| POST | `/check-out` | Employee | Record check-out, compute worked hours, notify employee + HR |
| GET | `/today` | Employee | Today's attendance record |
| GET | `/weekly` | Employee | Last 7 attendance records |

**Leave** (`/api/leave`)
| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/` | Employee | Submit a leave request |
| GET | `/my` | Employee | Own leave requests |
| GET | `/all` | HR | All leave requests |
| GET | `/:id` | Authenticated (owner or HR) | Single leave request |
| POST | `/:id/approve` | HR | Approve a pending request |
| POST | `/:id/reject` | HR | Reject a pending request |

**Payroll** (`/api/payroll`)
| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/me` | Employee | Own payroll history |
| GET | `/all` | HR | Payroll across all employees |
| GET | `/:employeeId` | HR | Payroll for one employee |

**Employees** (`/api/employees`)
| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/` | HR | List all employees |
| GET | `/:id` | Authenticated (self or HR) | Single employee profile |
| PUT | `/:id` | Authenticated (self or HR) | Update profile (HR: org fields; employee: contact fields only) |

**Analytics** (`/api/analytics`)
| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/hr` | HR | Total workforce, today's attendance, attendance rate, pending leaves, total payroll |

**Notifications** (`/api/notifications`)
| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/` | Authenticated | Latest 50 notifications for the user |
| POST | `/:id/read` | Authenticated | Mark one notification read |
| POST | `/read-all` | Authenticated | Mark all notifications read |

**Reports** (`/api/reports`)
| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/attendance` | HR | All attendance records + present/absent counts |
| GET | `/leave` | HR | All leave records + pending/approved/rejected counts |
| GET | `/payroll` | HR | All payroll records + total payroll |

## Project Structure

```
Dayflow---Human-Resource-Management-System/
├── app/                     # Next.js App Router
│   ├── dashboard/           # Employee: home, attendance, leave, payroll, profile
│   ├── hr/                  # HR: dashboard, employees, payroll, reports
│   ├── login/  signup/
│   ├── layout.tsx  page.tsx  not-found.tsx  error.tsx
├── backend/
│   ├── db/                  # index.js (pg pool + seed), schema.sql
│   ├── middleware/          # auth.js (JWT verify, role guard)
│   ├── routes/              # auth, attendance, leave, payroll, employees,
│   │                        # analytics, notifications, reports
│   ├── server.js
│   └── .env.example
├── components/
│   ├── ui/                  # shadcn-style primitives
│   ├── layout/
│   ├── FuzzyText.jsx  TextPressure.jsx  ClickSpark.jsx  GlobalClickSpark.tsx
├── lib/                     # api.ts (fetch wrapper), auth.tsx, utils.ts
├── docs/                    # api-contract.md, file-ownership.md
├── prompts/                 # hackathon planning/process notes
├── templates/                # planning/report templates
├── next.config.mjs          # rewrites /api/* to backend
└── package.json
```

## Installation

**Prerequisites:** Node.js, npm, and a running PostgreSQL server.

**1. Clone**
```bash
git clone https://github.com/Zynx095/Dayflow---Human-Resource-Management-System.git
cd Dayflow---Human-Resource-Management-System
```

**2. Backend**
```bash
cd backend
npm install
cp .env.example .env
# edit .env — set DATABASE_URL to a real Postgres database and a real JWT_SECRET
npm run dev      # nodemon, or: npm start
```
The schema is created automatically on startup (`CREATE TABLE IF NOT EXISTS`), and demo accounts are seeded on first run if the `users` table is empty.

**3. Frontend** (from the project root, in a separate terminal)
```bash
npm install
npm run dev
```

## Environment Variables

Configured in `backend/.env` (see `backend/.env.example`):

| Variable | Required | Purpose |
|---|---|---|
| `PORT` | No | Backend listen port. Code default is `3000`; `.env.example` suggests `3001` to match the frontend's proxy target — **use `3001` unless you also update `next.config.mjs`**. |
| `JWT_SECRET` | Recommended | Signing secret for JWTs. Falls back to a hardcoded dev value if unset — do not rely on the fallback outside local development. |
| `DATABASE_URL` | Yes | PostgreSQL connection string. Defaults to `postgres://postgres:postgres@localhost:5432/dayflow` if unset. |

The frontend has no required `.env` of its own; it calls the backend through the `/api/*` rewrite defined in `next.config.mjs`, which currently points at `http://localhost:3001`.

## Running the Application

1. Start PostgreSQL and ensure `DATABASE_URL` points to it.
2. Start the backend: `cd backend && npm run dev` — listens on `PORT` (3000 by default in code, 3001 recommended per `.env.example`).
3. Start the frontend: `npm run dev` from the project root — Next.js dev server at `http://localhost:3000`.

If both run on port 3000, change the backend's `PORT` (to `3001`, matching the existing rewrite config) or update `next.config.mjs` to match your chosen backend port.

## Testing

There is no automated test runner wired into `npm test` (the root and backend `package.json` do not define a real test script). The repository does include manual/integration Node scripts that exercise a running backend:

```bash
# with the backend running locally:
node backend-test.js               # end-to-end API test sequence (auth, attendance, leave, payroll)
node backend/test.js                # additional backend API test sequence
node backend/test_payroll_checkout.js   # integration test for the checkout → payroll-status flow (talks to the DB directly)
```

Static checks:
```bash
npm run lint       # Next.js/ESLint, frontend
npx tsc --noEmit   # TypeScript type-check
npm run build      # Next.js production build
```

## Demo Flow

Seeded accounts (created automatically on first backend start, if the database is empty):

| Role | Email | Password |
|---|---|---|
| HR | `hr@dayflow.com` | `hr123` |
| Employee | `john@dayflow.com` | `emp123` |
| Employee | `priya@dayflow.com` | `emp123` |

Suggested walkthrough:
1. Log in as `john@dayflow.com`
2. View the employee dashboard
3. Check in — observe the live elapsed-time counter start
4. Check out — worked hours are calculated and the record's payment status updates
5. Open Payroll — view existing payroll history
6. Open Notifications — see the "payroll processed" notification
7. Submit a leave request
8. Log out, log in as `hr@dayflow.com`
9. View the HR dashboard — workforce count, today's attendance, pending leaves, attendance rate, total payroll
10. Open Employees — view the workforce list
11. Approve or reject the pending leave request from step 7
12. Open Reports (Attendance / Leave / Payroll) — view aggregated data
13. Open Notifications — see the checkout and leave-request notifications

## Screenshots

No screenshots are currently committed to the repository.

```
docs/screenshots/
├── landing.png
├── employee-dashboard.png
├── attendance.png
├── leave.png
├── payroll.png
├── hr-dashboard.png
└── reports.png
```
(Add screenshots to this path and reference them here once available.)

## Design System

- Solid surfaces, no glassmorphism
- Semantic status coloring for attendance/leave states (present/absent, pending/approved/rejected)
- Responsive layout across dashboard and HR views, with mobile navigation
- Framer Motion transitions on page/section entrance
- Loading, error, and empty states on data-fetching views (see the attendance history page for an example pattern)
- Custom interaction components: `ClickSpark` (click feedback), `TextPressure` (interactive text), `FuzzyText` (404 page)

## Engineering Decisions

- **Separate frontend/backend:** Next.js handles UI and routing; Express handles data and auth independently, connected via a Next.js rewrite rather than same-process coupling — keeps the API reusable and the concerns separated.
- **PostgreSQL over an embedded database:** using `pg` gives real relational integrity (foreign keys, `SERIAL` ids, unique constraints like one-attendance-row-per-employee-per-day) at the cost of requiring a running Postgres instance rather than a zero-setup file-based database.
- **JWT + role middleware over sessions:** stateless tokens avoid server-side session storage and keep the API simple to reason about for a two-role system (`employee`, `hr`).
- **Payroll kept separate from attendance:** checkout updates the attendance record's `payment_status` and notifies the user, but payroll rows themselves are managed independently — this keeps "did they work" and "what they're paid" as distinct, auditable data rather than one recomputing the other implicitly.
- **Server-timestamp-based live duration:** the dashboard's live worked-time counter is derived from the server-recorded `check_in` timestamp and ticks client-side, so the displayed duration can't be spoofed by client clock manipulation of the underlying record.
- **Deferred features:** email verification, file uploads (e.g. leave-supporting documents), and automated salary-component calculation (Basic/HRA/PF) were intentionally left out of this build to keep the hackathon scope focused on the core attendance → leave → payroll-visibility loop.

## Known Limitations

- No automated salary-component calculator (Basic/HRA/PF) — payroll rows are managed/seeded data, not derived from attendance in real time.
- No email verification on sign-up.
- No file upload support (e.g. for leave documentation).
- No password reset / forgot-password flow.
- No automated test suite wired to `npm test`; testing is via manual scripts against a running backend.
- `JWT_SECRET` has a hardcoded development fallback if not set via environment variable.
- Notifications and attendance/leave data are fetched by request (polling on load / on action), not pushed in real time.
- Half-day or partial-day attendance status is not distinguished — attendance is recorded as present/absent for the day.

## Future Roadmap

**Near-term**
- Automated payroll computation from attendance and configured salary structure
- Password reset flow
- Email notifications alongside in-app notifications
- File upload support for leave requests

**Future**
- Real-time (push-based) notifications
- Multi-level approval workflows
- Configurable leave policies and holiday calendars
- Deployment configuration for hosted environments

## Team

**Yukith** — Backend Architecture · Database Design · Security · API Integration

**Pranathi** — Frontend Engineering · UI/UX · Responsive Design · Frontend Integration

## Hackathon Context

Dayflow was built during a hackathon as an implementation of the "Every workday, perfectly aligned" HRMS problem statement, covering authentication, role-based access, attendance, leave, payroll visibility, and HR reporting within the hackathon timeframe.

## License

No license file is currently present in this repository. Licensing terms have not yet been specified.
