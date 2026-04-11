-- Run this ONCE to create the initial admin account.
-- Password is: Admin1234!
-- After logging in, go to Change Password immediately.
--
-- To generate a fresh hash for a different password, run:
--   node -e "import('bcrypt').then(b=>b.default.hash('YourPassword',12).then(console.log))"
-- then replace the hash below.

INSERT INTO user_account (email, password_hash, role)
VALUES (
  'admin@campusconnect.edu',
  '$2b$12$3IlngtPLxAtBOetblB7crOJllJVRY5JR9nJ/OeKM0N4mubA/DUNbO',
  'admin'
)
ON DUPLICATE KEY UPDATE role = 'admin';

SET @admin_id = (SELECT id FROM user_account WHERE email = 'admin@campusconnect.edu');

INSERT INTO user_profile (user_id, display_name, campus, major)
VALUES (@admin_id, 'System Admin', 'Virginia Tech', 'Administration')
ON DUPLICATE KEY UPDATE display_name = 'System Admin';
