SELECT
  s.id AS student_id,
  s.name,
  s.email
FROM students AS s
LEFT JOIN users AS u
  ON s.email = u.email
WHERE u.id IS NULL;