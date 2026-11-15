# Database setup and references

Flyway migrations in `backend/src/main/resources/db/migration` are the application source of truth. Spring is configured with `ddl-auto=validate`. The SQL files here are standalone reference/development scripts; Compose does not mount them into MySQL's initialization folder.

## Files

- `schema.sql`: complete MySQL 8 reference schema. It drops and recreates tables, so use only against a disposable local database.
- `seed.sql`: development-only optional administrator bootstrap. Supply an email, full name, and BCrypt hash as MySQL session variables; the script has no default credentials and does nothing when the variables are unset.
- `sample_data.sql`: idempotent sample project/task rows tied to the seeded local administrator.

Flyway creates the schema automatically when the backend starts. To create an isolated local database manually, execute `schema.sql`, then set the seed variables and source the development data scripts in the same MySQL session.
