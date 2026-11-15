# Security design

- Passwords are validated and hashed with BCrypt. Password hashes are omitted from response DTOs.
- Registration assigns `TEAM_MEMBER`; role assignment is available only through administrator-protected APIs.
- Spring Security is stateless and authenticates bearer JWT access tokens through a custom filter. Access tokens are short-lived according to `JWT_EXPIRATION`.
- Refresh tokens are random values with expiry, rotated on refresh, and revoked on logout. Current implementation stores refresh tokens in the database and browser auth state in local storage; an HttpOnly Secure cookie deployment would provide stronger protection from script access.
- Project/task service methods validate membership and ownership to prevent guessed-ID access. Task updates and status transitions have different permission rules.
- DTO validation and centralized exception handling avoid returning stack traces. Dev and production server error details are disabled.
- CORS is limited to `CORS_ALLOWED_ORIGIN`; bearer-token requests do not require credentialed cookies.
- DB credentials and JWT secret come from environment variables. Example values are placeholders, not production secrets.

Production deployments still need HTTPS termination, secret rotation, rate limiting/login abuse controls, database backups, and a securely provisioned initial administrator. Password recovery/email is not configured.
