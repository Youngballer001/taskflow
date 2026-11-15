# Deployment guide

## Local Compose deployment

1. Copy `.env.example` to `.env` and create unique values for DB passwords and `JWT_SECRET` (minimum 32 random bytes).
2. Start Docker Desktop and run `docker compose up --build` from the repository root.
3. Visit `http://localhost:5173`; Nginx serves the SPA and proxies `/api` to Spring Boot. MySQL data persists in `mysql-data`.

## Production requirements

Do not deploy example values. Put secrets in a managed secret store, restrict network access to MySQL, publish HTTPS through a reverse proxy/load balancer, set `CORS_ALLOWED_ORIGIN` to the production origin, configure backups/restore tests and log monitoring, and use a least-privilege database account. Configure resource limits and health checks according to the hosting platform.

Compose configuration syntax has been validated, but image builds and live startup must be tested in an environment with an active Docker daemon. No production HTTPS termination is included in this repository.
