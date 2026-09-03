const pool = require("../config/db");

const Company = {
  create: async (userId, data) => {
    const result = await pool.query(
      `INSERT INTO company_profiles
       (user_id, company_name, company_type, industry, website, email,
        office_address, state, district, pincode,
        representative_name, designation, mobile, alternate_email,
        cin_number, gst_number)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
       RETURNING *`,
      [
        userId, data.company_name, data.company_type, data.industry,
        data.website, data.email, data.office_address, data.state,
        data.district, data.pincode, data.representative_name,
        data.designation, data.mobile, data.alternate_email,
        data.cin_number, data.gst_number,
      ]
    );
    return result.rows[0];
  },

  findById: async (id) => {
    const result = await pool.query(
      "SELECT * FROM company_profiles WHERE id = $1",
      [id]
    );
    return result.rows[0];
  },

  findByUserId: async (userId) => {
    const result = await pool.query(
      "SELECT * FROM company_profiles WHERE user_id = $1",
      [userId]
    );
    return result.rows[0];
  },

  findByEmail: async (email) => {
    const result = await pool.query(
      "SELECT * FROM company_profiles WHERE email = $1",
      [email]
    );
    return result.rows[0];
  },

  getAll: async (limit = 20, offset = 0) => {
    const result = await pool.query(
      "SELECT * FROM company_profiles ORDER BY created_at DESC LIMIT $1 OFFSET $2",
      [limit, offset]
    );
    return result.rows;
  },

  update: async (id, updateData) => {
    const fields = Object.keys(updateData);
    const values = Object.values(updateData);

    const setClause = fields
      .map((field, index) => `${field} = $${index + 1}`)
      .join(", ");

    const result = await pool.query(
      `UPDATE company_profiles
       SET ${setClause}, updated_at = CURRENT_TIMESTAMP
       WHERE id = $${fields.length + 1}
       RETURNING *`,
      [...values, id]
    );
    return result.rows[0];
  },

  delete: async (id) => {
    const result = await pool.query(
      "DELETE FROM company_profiles WHERE id = $1 RETURNING *",
      [id]
    );
    return result.rows[0];
  },
};

module.exports = Company;
