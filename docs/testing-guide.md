# Testing guide

## Frontend

From `frontend` run:

```powershell
npm test
npm run build
```

The Node test runner currently verifies shared email/password/date/required-field validation rules. It does not render React components or exercise live API requests.

## Backend

From `backend` run:

```powershell
mvn clean test
```

The suite contains Mockito service/controller tests, JWT and password-validator tests, and JPA repository tests using H2 in MySQL compatibility mode. It does not require a personal MySQL database. The database migration itself still needs an integration run against MySQL 8.

## Docker and integration

Check Compose interpolation with `docker compose --env-file .env.example config`. To verify full integration, configure `.env`, start Docker Desktop, run `docker compose up --build`, register a user, and exercise project, task, notification, and Kanban operations. A Docker daemon and MySQL integration are not available in every development environment.
