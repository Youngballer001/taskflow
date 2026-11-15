# Requirements and current coverage

## Functional requirements

- Accounts can register, sign in, refresh access tokens, log out, and edit their profile/password.
- Administrators can search paged users, change roles, and activate/deactivate accounts.
- Project managers can create projects and manage projects, members, and tasks within authorized projects.
- Project members can read project tasks, discuss tasks, and change the status of tasks assigned to them.
- Users can view their notifications and activity, dashboard aggregates, and reports.
- Project invitations can be created and accepted/rejected.

## Non-functional requirements

- MySQL stores persistent business data; Flyway creates schema and Hibernate validates it.
- Passwords are BCrypt-hashed. Protected API operations enforce project and role authorization server-side.
- Request DTOs are validated, API responses use DTOs, and errors use centralized JSON handling.
- Frontend pages provide responsive layouts and API loading/error feedback.

## Known coverage limits

Password reset delivery, assignment/search pagination on every endpoint, audit retention after destructive project deletion, browser interaction tests, and end-to-end tests are not fully implemented. Acceptance of this requirements document does not imply these items are complete.
