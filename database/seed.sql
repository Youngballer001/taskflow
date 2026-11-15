-- Development bootstrap only. Never commit real credentials or use this for production.
-- Create a BCrypt hash outside MySQL, then set these session variables before sourcing:
-- SET @taskflow_seed_email = 'admin@example.test';
-- SET @taskflow_seed_full_name = 'Local Administrator';
-- SET @taskflow_seed_password_hash = '$2a$...';
-- All values default to NULL so sourcing this file without explicit inputs creates no account.

INSERT INTO users (email, password, full_name, role, is_active)
SELECT LOWER(TRIM(@taskflow_seed_email)), @taskflow_seed_password_hash,
       TRIM(@taskflow_seed_full_name), 'ADMIN', TRUE
WHERE @taskflow_seed_email IS NOT NULL
  AND @taskflow_seed_password_hash IS NOT NULL
  AND @taskflow_seed_full_name IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM users WHERE email = LOWER(TRIM(@taskflow_seed_email)));
