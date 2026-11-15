# TaskFlow project overview

TaskFlow is a web application for organizing team projects and tasks. The current implementation combines a React/Vite frontend with a Java 21/Spring Boot REST API and a MySQL database.

## Scope implemented

The backend supports registration/login, refresh tokens, project and task APIs, project membership, comments, notifications, activity logging, dashboard/report aggregates, invitations, and administrator user controls. Frontend routes cover authentication, projects, tasks, task discussion, Kanban, team membership, notifications, reports, profile, settings, and administration.

## Users

- `ADMIN`: user administration and project/task administration.
- `PROJECT_MANAGER`: create projects and manage projects where they are a member or owner.
- `TEAM_MEMBER`: read projects they belong to, comment, and update their assigned task status.

New registrations receive `TEAM_MEMBER`. No administrator is created automatically. See the database guide for a local-only bootstrap procedure.

## Current limits

Password reset email delivery and comprehensive browser-level tests are not configured. Some non-core list APIs do not yet provide server-side pagination/filtering, and database migration/integration execution requires a running MySQL 8 service.
