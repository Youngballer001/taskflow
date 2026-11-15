-- Development/demo data only. Run schema.sql or Flyway first, then seed.sql with a local admin.
-- The SQL below is a no-op until @taskflow_seed_email is configured in this MySQL session.

INSERT INTO projects (name, description, owner_id, start_date, due_date, status)
SELECT 'Sample Website Refresh', 'Development sample project; safe to remove.', u.id,
       CURRENT_DATE, DATE_ADD(CURRENT_DATE, INTERVAL 30 DAY), 'ACTIVE'
FROM users u
WHERE u.email = LOWER(TRIM(@taskflow_seed_email))
  AND NOT EXISTS (SELECT 1 FROM projects WHERE name = 'Sample Website Refresh' AND owner_id = u.id);

INSERT INTO project_members (project_id, user_id, role)
SELECT p.id, p.owner_id, 'OWNER'
FROM projects p
WHERE p.name = 'Sample Website Refresh'
  AND NOT EXISTS (SELECT 1 FROM project_members pm WHERE pm.project_id = p.id AND pm.user_id = p.owner_id);

INSERT INTO tasks (title, description, project_id, created_by_id, priority, status, due_date)
SELECT 'Review sample requirements', 'Development sample task; safe to remove.', p.id,
       p.owner_id, 'MEDIUM', 'TODO', p.due_date
FROM projects p
WHERE p.name = 'Sample Website Refresh'
  AND NOT EXISTS (SELECT 1 FROM tasks t WHERE t.project_id = p.id AND t.title = 'Review sample requirements');
