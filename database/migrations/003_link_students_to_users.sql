ALTER TABLE students
ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE CASCADE;


UPDATE students AS s
SET user_id = u.id
FROM users AS u
WHERE s.email = u.email
  AND s.user_id IS NULL;



ALTER TABLE students
ADD CONSTRAINT students_user_id_unique UNIQUE (user_id);