const pool = require("../config/db");
const logger = require("../utils/logger");

const User = {
  // Find user by email
  findByEmail: async (email) => {
    try {
      const result = await pool.query("SELECT * FROM users WHERE email = $1", [
        email,
      ]);
      return result.rows[0] || null;
    } catch (error) {
      logger.error("Error finding user by email", error);
      throw error;
    }
  },

  // Find user by ID
  findById: async (id) => {
    try {
      const result = await pool.query(
        "SELECT id, email, role, created_at FROM users WHERE id = $1",
        [id],
      );
      return result.rows[0] || null;
    } catch (error) {
      logger.error("Error finding user by ID", error);
      throw error;
    }
  },

  // Create new user
  create: async (email, passwordHash, role) => {
    try {
      const result = await pool.query(
        `INSERT INTO users (email, password_hash, role)
         VALUES ($1, $2, $3)
         RETURNING id, email, role, created_at`,
        [email, passwordHash, role],
      );
      return result.rows[0];
    } catch (error) {
      logger.error("Error creating user", error);
      throw error;
    }
  },

  // Update user
  update: async (id, data) => {
    try {
      const fields = [];
      const values = [];
      let index = 1;

      for (const key in data) {
        fields.push(`${key} = $${index}`);
        values.push(data[key]);
        index++;
      }

      values.push(id);

      const result = await pool.query(
        `UPDATE users
         SET ${fields.join(", ")}
         WHERE id = $${index}
         RETURNING *`,
        values,
      );
      return result.rows[0] || null;
    } catch (error) {
      logger.error("Error updating user", error);
      throw error;
    }
  },

  // Delete user
  delete: async (id) => {
    try {
      await pool.query("DELETE FROM users WHERE id = $1", [id]);
      return true;
    } catch (error) {
      logger.error("Error deleting user", error);
      throw error;
    }
  },

  // Get all users
  getAll: async (limit = 20, offset = 0) => {
    try {
      const result = await pool.query(
        `SELECT id, email, role, created_at FROM users
         ORDER BY created_at DESC
         LIMIT $1 OFFSET $2`,
        [limit, offset],
      );
      return result.rows;
    } catch (error) {
      logger.error("Error fetching users", error);
      throw error;
    }
  },

  // Count users
  count: async () => {
    try {
      const result = await pool.query("SELECT COUNT(*) FROM users");
      return parseInt(result.rows[0].count);
    } catch (error) {
      logger.error("Error counting users", error);
      throw error;
    }
  },

  // Check if email exists
  emailExists: async (email) => {
    try {
      const result = await pool.query(
        "SELECT id FROM users WHERE email = $1 LIMIT 1",
        [email],
      );
      return result.rows.length > 0;
    } catch (error) {
      logger.error("Error checking email existence", error);
      throw error;
    }
  },
};

module.exports = User;
