# 🌊 Dayflow HRMS

> **The offline-first, locally secure HR Intelligence Platform engineered for the Indian Enterprise.**

---

## 🚀 The Vision

Cloud-based HR systems are often bloated, reliant on constant internet connectivity, and vulnerable to external data breaches. For Indian enterprises operating in diverse connectivity environments, HR operations cannot afford to halt when the internet drops.

**Dayflow** is the solution. We built an enterprise-grade, locally-hosted Human Resource Management System that brings zero-latency performance, strict data sovereignty, and real-time analytics to the local network.

---

## ⚡ Core Features & Engineering

We didn't just build a CRUD app; we engineered a secure, role-based ecosystem from the ground up.

| Feature | Description |
| --- | --- |
| **Dayflow Insights Engine** | Real-time, localized analytical dashboard for HR officers. Tracks workforce attendance, pending leaves, and active employees without external API calls. |
| **Smart ID Generation** | Automated, custom login IDs upon employee creation (`OIJODO20260001` - *Company + Initials + Year + Serial*), eliminating manual username management. |
| **Dynamic Indian Payroll** | Automated Salary Math tailored for India. Computes Basic Salary (50% of Wage), HRA (50% of Basic), and Provident Fund natively in **INR (₹)** with `en-IN` formatting. |
| **Enterprise Security** | Bulletproofed Express backend featuring strict JWT role-based access control (RBAC), custom middleware, and comprehensive IDOR & SQLi mitigation. |
| **Real-Time Attendance** | Frictionless employee check-in/check-out system with dynamic visual status indicators (Present/Absent/On Leave). |
| **Framer Motion UI** | A pixel-perfect, highly responsive Next.js frontend with staggered card entrances, skeleton loaders, and elegant state transitions. |

---

## 🛠️ The Architecture Stack

* **Frontend:** Next.js, Tailwind CSS, Framer Motion, TypeScript, `lucide-react`.
* **Backend:** Node.js, Express.js, Custom JWT Authentication.
* **Database:** SQLite (Zero-config, offline-first, local persistence).
* **Security:** Role-based Authorization Middleware, Parameterized Queries, Stateless Sessions.

---

## 💻 Local Setup & Deployment

Get the entire Dayflow ecosystem running locally in under two minutes.

**1. Clone the Repository**

```bash
git clone https://github.com/Zynx095/Dayflow---Human-Resource-Management-System.git
cd Dayflow---Human-Resource-Management-System

```

**2. Setup the Backend Engine**

```bash
cd backend
npm install
# Create a .env file and add your JWT_SECRET (or rely on the dev fallback)
npm run dev
# The Express server will spin up on port 5000 and initialize the SQLite schema

```

**3. Setup the Frontend UI**
Open a new terminal window:

```bash
# From the root project directory
npm install
npm run dev
# The Next.js frontend will be live at http://localhost:3000

```

---

## 👥 The Team

Built from the ground up during an intensive hackathon sprint.

* **Yukith** – Backend Architecture, Database Design, Security & API Integration
* **Pranathi** – Frontend Engineering, UI/UX Polish, Framer Motion & Localization

---

*Dayflow: Because your workforce data belongs on your local network.*
