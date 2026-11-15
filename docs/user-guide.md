# User guide

## Account access

Register with a name, email, and password of at least eight characters containing a letter and number. New accounts have the `TEAM_MEMBER` role. An administrator must promote a trusted account to `PROJECT_MANAGER` before it can create projects.

## Projects and teams

Use Projects to view projects you own or joined. Project managers create projects, review details, update project metadata/status, and manage members from the Team page. Add a registered user using their email. An invitation API also supports acceptance/rejection.

## Tasks and discussion

Project managers create and assign tasks. Open a task from the task list to see details and comments. Assignees and project managers can update task status according to server authorization. Use the Kanban page to drag a task between status columns; failed saves restore the previous status and display an error.

## Notifications and reports

Notifications can be marked read, marked all read, or deleted. Dashboard and report values come from backend API aggregates scoped to projects available to the current user.

## Profile and preferences

Edit profile details and change a password from Profile. Settings toggles a browser-local light/dark preference. Administrators can search users, adjust roles, and activate or deactivate accounts under Administration.

Password reset is not available. If locked out, request help from the administrator. Some broader project/task filtering and editing controls are not yet exposed in every page.
