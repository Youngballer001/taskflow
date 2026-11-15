# REST API reference

Base path: `/api`. JSON DTOs are returned. All endpoints require a valid `Authorization: Bearer <accessToken>` header except the four authentication endpoints and OpenAPI/health routes.

## Authentication

| Method | Path | Access | Purpose |
|---|---|---|---|
| POST | `/auth/register` | Public | Register; body has `fullName,email,password,confirmPassword` |
| POST | `/auth/login` | Public | Login; body has `email,password` |
| POST | `/auth/refresh` | Public + refresh token body | Rotate refresh token and issue a new pair |
| POST | `/auth/logout` | Public + refresh token body | Revoke supplied refresh token |

## Users and administration

- `GET /users/me`, `PUT /users/me`, `PUT /users/me/password`
- `GET /users/{id}` (admin or same user); `GET /users`, `GET /users/paged` (admin)
- `GET /admin/users?search=&page=&size=` (admin, Spring page response)
- `PATCH /admin/users/{id}/role` with `{ "role": "TEAM_MEMBER" }` (admin)
- `PATCH /admin/users/{id}/active?value=true|false` (admin)

## Projects and membership

- `GET /projects`, `POST /projects`, `GET /projects/{id}`, `PUT /projects/{id}`, `DELETE /projects/{id}`
- `GET /projects/{id}/members`, `POST /projects/{id}/members` with `{ "email": "..." }`, `DELETE /projects/{id}/members/{userId}`
- `POST /projects/{id}/invitations` with `{ "userId": 12 }`
- `GET /invitations`, `POST /invitations/{id}/accept`, `POST /invitations/{id}/reject`

Project operations are restricted to owners, project members with applicable roles, and administrators as enforced by the service.

## Tasks, discussion, and activity

- `GET /tasks`, `GET /tasks/project/{projectId}`, `GET /tasks/{id}`
- `POST /tasks`, `PUT /tasks/{id}`, `PATCH /tasks/{id}/status`, `DELETE /tasks/{id}`
- `GET|POST /tasks/{id}/comments`, `PUT|DELETE /tasks/{id}/comments/{commentId}`
- `GET /activity`

Task status is one of `TODO, IN_PROGRESS, IN_REVIEW, COMPLETED, CANCELLED`; priority is `LOW, MEDIUM, HIGH, URGENT`.

## Dashboard, reports, notifications

- `GET /dashboard`, `GET /reports?period=monthly`
- `GET /notifications`, `GET /notifications/unread-count`
- `PATCH /notifications/{id}/read`, `PATCH /notifications/read-all`, `DELETE /notifications/{id}`

Interactive OpenAPI UI is at `/swagger-ui/index.html`; JSON spec at `/v3/api-docs`. Full request/response schemas are generated from controller DTOs.

Current limits: task/project list filters and pagination are not consistently implemented across all routes. Invitation status responses are JSON DTOs. Password reset is not available.
