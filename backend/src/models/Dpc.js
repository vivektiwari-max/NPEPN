const pool = require("../config/db"); // FIX: Correct Database import

class Dpc {
  
  static async create(dpcData) {
    const { dpcName, district, state, pincode, address, officialEmail, officialMobile, landline, website, officerName, designation, officerEmail, officerMobile, password } = dpcData;

    try {
      const query = `
        INSERT INTO district_placement_cells (
          dpc_name, district, state, pincode, address, official_email, 
          official_mobile, landline, website, officer_name, designation, 
          officer_email, officer_mobile, password
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) 
        RETURNING id;
      `;
      
      const values = [
        dpcName, district, state, pincode, address, officialEmail, 
        officialMobile, landline, website, officerName, designation, 
        officerEmail, officerMobile, password
      ];

      const result = await pool.query(query, values);
      return result.rows[0]; 
    } catch (error) {
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
      const query = `SELECT * FROM district_placement_cells WHERE official_email = $1 OR officer_email = $1`;
      const result = await pool.query(query, [email]);
      return result.rows[0]; 
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Dpc;
