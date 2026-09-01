const pool = require("../config/db");
const logger = require("../utils/logger");

const College = {
  // Create college
  create: async (collegeData, client = null) => {
    const db = client || pool;
    try {
      const {
        user_id,
        college_id,
        institution_name,
        university,
        institution_type,
        affiliation,
        authorized_person,
        mobile,
        address,
        website,
      } = collegeData;

      const result = await db.query(
        `INSERT INTO college_profiles
         (user_id, college_id, institution_name, university, institution_type, 
          affiliation, authorized_person, mobile, address, website)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING *`,
        [
          user_id,
          college_id,
          institution_name,
          university,
          institution_type,
          affiliation,
          authorized_person,
          mobile,
          address,
          website,
        ],
      );
      return result.rows[0];
    } catch (error) {
      logger.error("Error creating college", error);
      throw error;
    }
  },

  // Find college by ID
  findById: async (collegeId) => {
    try {
      const result = await pool.query(
        `SELECT * FROM college_profiles WHERE college_id = $1`,
        [collegeId],
      );
      return result.rows[0] || null;
    } catch (error) {
      logger.error("Error finding college by ID", error);
      throw error;
    }
  },

  // Find college by user ID
  findByUserId: async (userId) => {
    try {
      const result = await pool.query(
        `SELECT * FROM college_profiles WHERE user_id = $1`,
        [userId],
      );
      return result.rows[0] || null;
    } catch (error) {
      logger.error("Error finding college by user ID", error);
      throw error;
    }
  },

  // Get all colleges from main colleges table
  getAll: async (limit = 100, offset = 0) => {
    try {
      const result = await pool.query(
        `SELECT id, college_name, state, district, city, college_type
         FROM colleges
         ORDER BY college_name ASC
         LIMIT $1 OFFSET $2`,
        [limit, offset],
      );
      return result.rows;
    } catch (error) {
      logger.error("Error fetching colleges", error);
      throw error;
    }
  },

  // Search colleges
  search: async (searchTerm, state, district) => {
    try {
      let query = `
        SELECT id, college_name, state, district, city, college_type
        FROM colleges
        WHERE 1=1
      `;
      const values = [];
      let index = 1;

      if (searchTerm) {
        const searchWords = searchTerm
          .trim()
          .split(/\s+/)
          .filter((w) => w.length > 1);
        searchWords.forEach((word) => {
          query += `
            AND (
              college_name ILIKE $${index}
              OR state ILIKE $${index}
              OR district ILIKE $${index}
              OR city ILIKE $${index}
            )
          `;
          values.push(`%${word}%`);
          index++;
        });
      }

      if (state) {
        query += ` AND state ILIKE $${index}`;
        values.push(state);
        index++;
      }

      if (district) {
        query += ` AND district ILIKE $${index}`;
        values.push(district);
        index++;
      }

      query += ` ORDER BY college_name ASC LIMIT 100`;

      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      logger.error("Error searching colleges", error);
      throw error;
    }
  },

  // Update college
  update: async (collegeId, collegeData) => {
    try {
      const fields = [];
      const values = [];
      let index = 1;

      for (const key in collegeData) {
        fields.push(`${key} = $${index}`);
        values.push(collegeData[key]);
        index++;
      }

      if (fields.length === 0) {
        return await College.findById(collegeId);
      }

      values.push(collegeId);

      const result = await pool.query(
        `UPDATE college_profiles
         SET ${fields.join(", ")}
         WHERE college_id = $${index}
         RETURNING *`,
        values,
      );
      return result.rows[0] || null;
    } catch (error) {
      logger.error("Error updating college", error);
      throw error;
    }
  },

  // Delete college
  delete: async (collegeId) => {
    try {
      await pool.query("DELETE FROM college_profiles WHERE college_id = $1", [
        collegeId,
      ]);
      return true;
    } catch (error) {
      logger.error("Error deleting college", error);
      throw error;
    }
  },

  // Count colleges
  count: async () => {
    try {
      const result = await pool.query("SELECT COUNT(*) FROM colleges");
      return parseInt(result.rows[0].count);
    } catch (error) {
      logger.error("Error counting colleges", error);
      throw error;
    }
  },

  // Check if college ID exists
  collegeIdExists: async (collegeId) => {
    try {
      const result = await pool.query(
        "SELECT id FROM college_profiles WHERE college_id = $1 LIMIT 1",
        [collegeId],
      );
      return result.rows.length > 0;
    } catch (error) {
      logger.error("Error checking college ID existence", error);
      throw error;
    }
  },
};

module.exports = College;
