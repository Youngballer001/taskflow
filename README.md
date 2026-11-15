# TaskFlow

TaskFlow is a project and task management application built with React, Spring Boot, and MySQL. The repository contains a substantial working implementation, but some requested modules and test coverage remain incomplete; see [Known gaps](#known-gaps).

## Implemented features

- Registration and login with BCrypt password hashing and JWT access tokens.
- Database-backed refresh token rotation and logout.
- Project and task APIs with project membership checks and role-aware mutations.
- Task comments, notifications, activity records, dashboard aggregates, and reports on the backend.
- Responsive React pages for authentication, projects, tasks, dashboard, reports, notifications, and profile.
- Kanban board with persisted task status changes and rollback on API errors.
- Flyway migrations, Dockerfiles, Compose, Nginx API proxy, and OpenAPI UI.

## Technology

- Java 21, Spring Boot 3.x, Spring Security, Spring Data JPA, Flyway, Maven
- React 18, Vite, React Router, Axios, Recharts
- MySQL 8
- Docker Compose and Nginx

## Requirements

- Java 21 and Maven 3.8+
- Node.js 18+ and npm
- MySQL 8, or Docker Desktop with Compose

## Local setup (Windows 11)

1. Copy `.env.example` to `.env` in the project root. Replace the example database passwords and `JWT_SECRET` with private values. Keep the JWT secret at least 32 bytes long.
2. Create the database `taskflow_db` and a MySQL user matching `DB_USERNAME` and `DB_PASSWORD`. Flyway creates the tables on backend startup.
3. In a PowerShell terminal, set the backend variables from `.env` or export them in your user environment. Start the backend:

   ```powershell
   cd backend
   mvn spring-boot:run
   ```

4. In another terminal, start the frontend. Vite proxies `/api` to `http://localhost:8080`:

   ```powershell
   cd frontend
   npm install
   npm run dev
   ```

5. Open `http://localhost:5173`. Swagger UI is at `http://localhost:8080/swagger-ui/index.html`.

## Docker Compose

From the repository root, configure `.env`, then run:

```powershell
docker compose up --build
```

Open `http://localhost:5173`. MySQL data is persisted in the `mysql-data` volume. Flyway owns schema creation; the standalone SQL files are reference/development scripts and are not mounted into the MySQL initialization directory.

## Verification

```powershell
cd frontend
npm test
npm run build
```

Backend tests can be run with `cd backend; mvn test`. Docker configuration can be checked with `docker compose --env-file .env.example config`.

## Project layout

- `backend/src/main/java`: Spring controllers, services, repositories, entities, DTOs, security, and validation
- `backend/src/main/resources/db/migration`: Flyway migrations
- `frontend/src`: React routes, pages, API clients, and styles
- `database`: schema and sample SQL references
- `docker`: backend/frontend images and Nginx configuration
- `docs`: architecture, requirements, database, API, setup, user, security, testing, and deployment guides

## Known gaps

The frontend build and shared-validation tests are verified. Backend code compiles and five focused JUnit tests pass. The Docker daemon is unavailable, so MySQL integration/migration execution and image builds remain unverified. Password reset email delivery and full browser-level frontend tests remain incomplete. New registrations receive the `TEAM_MEMBER` role. For local development only, `database/seed.sql` accepts an explicitly supplied email, full name, and BCrypt hash; no demo password is stored in the repository.

See the individual guides under `docs/` for more details. Do not use the example environment values in production. Configure HTTPS and production secrets before deployment.
