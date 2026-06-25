#  Task Management System API

A production-ready RESTful API for managing projects and tasks, built with **Node.js**, **TypeScript**, **Express**, and **MongoDB**.

---

##  Features

-  JWT Authentication (Access + Refresh Tokens)
-  Email Verification via OTP
-  Forget & Reset Password
-  Role-Based Access Control (Admin / Member)
-  Project Management (CRUD)
-  Task Management with priority, status, and assignment
-  Pagination, Filtering, Sorting & Field Selection
-  Security: Helmet, HPP, CORS, Rate Limiting
-  Docker & Docker Compose ready

---

##  Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js |
| Language | TypeScript |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Authentication | JWT (jsonwebtoken) |
| Validation | Zod |
| Email | Nodemailer (Gmail) |
| Security | Helmet, HPP, CORS, express-rate-limit |
| Containerization | Docker + Docker Compose |

---

##  Project Structure

```
src/
├── config/         # Database connection
├── models/         # Mongoose schemas (User, Project, Task)
├── routes/         # Express routers
├── controllers/    # Request handlers
├── services/       # Business logic
├── middlewares/    # Auth, validation, error handling
├── validation/     # Zod schemas
├── utils/          # JWT helpers, ApiFeatures
└── email/          # Email service & templates
```

---

##  Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB Atlas](https://www.mongodb.com/atlas) account (or local MongoDB)
- Gmail account with [App Password](https://support.google.com/accounts/answer/185833) enabled
- [Docker](https://www.docker.com/) (optional, for containerized setup)

---

##  How to Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/your-username/task-management-system.git
cd task-management-system
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

Then open `.env` and fill in your values (see [Environment Variables](#-environment-variables) below).

### 4. Run in development mode

```bash
npm run dev
```

### 5. Build for production

```bash
npm run build
npm start
```

The server will start on the port defined in your `.env` (default: `5000`).

---

##  Run with Docker

### Using Docker Compose

```bash
docker-compose up --build
```

The API will be available at `http://localhost:5001`

---

##  Environment Variables

Copy `.env.example` to `.env` and fill in the required values:

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret for signing access tokens | `your_strong_secret` |
| `JWT_REFRESH_SECRET` | Secret for signing refresh tokens | `another_strong_secret` |
| `APP_EMAIL_ADDRESS` | Gmail address used to send emails | `you@gmail.com` |
| `APP_EMAIL_PASSWORD` | Gmail App Password (not your login password) | `xxxx xxxx xxxx xxxx` |
| `FRONTEND_URL` | Frontend URL for reset password links | `http://localhost:5173` |
| `NODE_ENV` | Environment (`development` / `production`) | `development` |

---

##  API Endpoints

### Auth — `/api/v1/auth`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/register` | Register a new user | Public |
| POST | `/login` | Login and get tokens | Public |
| POST | `/logout` | Clear auth cookies | Public |
| POST | `/verify-otp` | Verify account with OTP | Public |
| POST | `/resend-otp` | Resend OTP to email | Public |
| POST | `/forget-password` | Send reset password email | Public |
| POST | `/reset-password` | Reset password with token | Public |
| POST | `/refresh-token` | Get new access token | Cookie |

### Projects — `/api/v1/project`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | Get all projects (paginated) | Token |
| POST | `/` | Create a project | Admin |
| GET | `/count` | Get total project count | Token |
| GET | `/:id` | Get project by ID | Token |
| PATCH | `/:id` | Update project | Admin |
| DELETE | `/:id` | Delete project | Admin |

### Tasks — `/api/v1/tasks`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | Get all tasks (paginated) | Member |
| POST | `/` | Create a task | Admin |
| GET | `/count` | Get total task count | Token |
| GET | `/project/:projectId` | Get tasks by project | Admin |
| GET | `/:id` | Get task by ID | Token |
| PATCH | `/:id` | Update task | Member |
| DELETE | `/:id` | Delete task | Admin |

---

##  Query Parameters (Filtering & Pagination)

All list endpoints support the following query parameters:

| Param | Description | Example |
|-------|-------------|---------|
| `page` | Page number | `?page=2` |
| `limit` | Items per page (max 100) | `?limit=20` |
| `sort` | Field to sort by | `?sort=createdAt` |
| `order` | Sort direction | `?order=desc` |
| `fields` | Select specific fields | `?fields=title,status` |
| `status` | Filter by status | `?status=Active` |
| `priority` | Filter by priority | `?priority=High` |

---

##  Roles & Permissions

| Action | Admin | Member |
|--------|:-----:|:------:|
| Create Project | ✅ | ❌ |
| View Projects | ✅ | ✅ |
| Update / Delete Project | ✅ | ❌ |
| Create Task | ✅ | ❌ |
| View Tasks | ✅ | ✅ |
| Update Task status | ✅ | ✅ |
| Delete Task | ✅ | ❌ |
