# Windows 11 installation guide

## Prerequisites

Install Java 21, Maven 3.8+, Node.js 18+, npm, and MySQL 8. Docker Desktop with Compose can replace the local MySQL setup.

## Local MySQL and backend

1. Create `taskflow_db` and a least-privilege MySQL user. Do not use the MySQL root account for the application.
2. In PowerShell, configure the process environment before starting Maven:

   ```powershell
   $env:DB_HOST = 'localhost'
   $env:DB_PORT = '3306'
   $env:DB_NAME = 'taskflow_db'
   $env:DB_USERNAME = 'taskflow_user'
   $env:DB_PASSWORD = '<your-local-db-password>'
   $env:JWT_SECRET = '<at-least-32-random-bytes>'
   $env:JWT_EXPIRATION = '900000'
   $env:BACKEND_PORT = '8080'
   cd backend
   mvn spring-boot:run
   ```

   Flyway applies migrations at startup; Hibernate validates the resulting schema.

## Frontend

In another PowerShell terminal:

```powershell
cd frontend
npm install
npm run dev
```

Vite proxies `/api` to `http://localhost:8080`. Visit `http://localhost:5173`.

## Docker

From the repository root copy `.env.example` to `.env`, replace all example values with local-only secrets, start Docker Desktop, then run `docker compose up --build`. The frontend is served on port 5173 and MySQL data persists in the Compose volume.

No administrator account is automatically seeded. For disposable development data only, follow `database/README.md` and provide your own BCrypt hash to the optional seed script.
