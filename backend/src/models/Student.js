const pool = require("../config/db");
const logger = require("../utils/logger");

const Student = {
  // Create student
  create: async (studentData) => {
    try {
      const { name, email, phone, degree, college, district, skills } =
        studentData;

      const result = await pool.query(
        `INSERT INTO students
         (name, email, phone, degree, college, district, skills)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [name, email, phone, degree, college, district, skills],
      );
      return result.rows[0];
    } catch (error) {
      logger.error("Error creating student", error);
      throw error;
    }
  },

  // Find student by email
  findByEmail: async (email) => {
    try {
      const result = await pool.query(
        `SELECT id, name, email, phone, degree, college, district, skills, created_at
         FROM students
         WHERE email = $1`,
        [email],
      );
      return result.rows[0] || null;
    } catch (error) {
      logger.error("Error finding student by email", error);
      throw error;
    }
  },

  // Find student by ID
  findById: async (id) => {
    try {
      const result = await pool.query(`SELECT * FROM students WHERE id = $1`, [
        id,
      ]);
      return result.rows[0] || null;
    } catch (error) {
      logger.error("Error finding student by ID", error);
      throw error;
    }
  },

  // Get all students
  getAll: async (limit = 20, offset = 0) => {
    try {
      const result = await pool.query(
        `SELECT id, name, email, phone, degree, college, district, skills, created_at
         FROM students
         ORDER BY created_at DESC
         LIMIT $1 OFFSET $2`,
        [limit, offset],
      );
      return result.rows;
    } catch (error) {
      logger.error("Error fetching students", error);
      throw error;
    }
  },

  // Update student
  update: async (id, studentData) => {
    try {
      const fields = [];
      const values = [];
      let index = 1;

      for (const key in studentData) {
        fields.push(`${key} = $${index}`);
        values.push(studentData[key]);
        index++;
      }

      if (fields.length === 0) {
        return await Student.findById(id);
      }

      values.push(id);

      const result = await pool.query(
        `UPDATE students
         SET ${fields.join(", ")}
         WHERE id = $${index}
         RETURNING *`,
        values,
      );
      return result.rows[0] || null;
    } catch (error) {
      logger.error("Error updating student", error);
      throw error;
    }
  },

  // Delete student
  delete: async (id) => {
    try {
      await pool.query("DELETE FROM students WHERE id = $1", [id]);
      return true;
    } catch (error) {
      logger.error("Error deleting student", error);
      throw error;
    }
  },

  // Count students
  count: async () => {
    try {
      const result = await pool.query("SELECT COUNT(*) FROM students");
      return parseInt(result.rows[0].count);
    } catch (error) {
      logger.error("Error counting students", error);
      throw error;
    }
  },

  // Search students by college
  searchByCollege: async (college, limit = 20) => {
    try {
      const result = await pool.query(
        `SELECT id, name, email, phone, degree, college, district, skills
         FROM students
         WHERE college ILIKE $1
         LIMIT $2`,
        [`%${college}%`, limit],
      );
      return result.rows;
    } catch (error) {
      logger.error("Error searching students by college", error);
      throw error;
    }
  },

  // Get students by district
  getByDistrict: async (district, limit = 20) => {
    try {
      const result = await pool.query(
        `SELECT id, name, email, phone, degree, college, district, skills
         FROM students
         WHERE district ILIKE $1
         ORDER BY name ASC
         LIMIT $2`,
        [district, limit],
      );
      return result.rows;
    } catch (error) {
      logger.error("Error fetching students by district", error);
      throw error;
    }
  },
};

module.exports = Student;
