# Database design

MySQL 8 schema is created by ordered Flyway migrations `V1`–`V9`. `spring.jpa.hibernate.ddl-auto=validate` makes mapping drift fail startup rather than silently changing production tables.

| Table | Purpose | Main relationships |
|---|---|---|
| `users` | Accounts, BCrypt hash, role and activation | Owner/assignee/author relationships |
| `projects` | Project metadata, owner, dates, status | Owner references `users` |
| `project_members` | Project membership and responsibility | Unique `(project_id,user_id)` |
| `tasks` | Project work, assignee, creator, dates, status/priority | Project, users |
| `task_comments` | Task discussion | Task and author |
| `activity_logs` | Immutable-style activity records | Actor, optional project/task |
| `notifications` | Per-user read state and message | User, optional project/task |
| `refresh_tokens` | Expiring refresh-token records | User |
| `project_invitations` | Invitation status and response time | Project, invited user, inviter |

Projects cascade to their tasks and memberships. Comments cascade with tasks. User deactivation is a soft status flag. The standalone `database/schema.sql` mirrors the migration schema for disposable local setups and is destructive because it drops existing tables; do not use it on a production database.

Migrations are not run in this environment against MySQL, so a live Flyway/Hibernate validation pass is still required.
