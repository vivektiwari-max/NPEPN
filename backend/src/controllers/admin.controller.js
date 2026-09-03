const pool = require("../config/db");
const { STATUS_CODES } = require("../config/constants");

const adminController = {
  getPendingAccounts: async (req, res, next) => {
    try {
      // Get pending companies/colleges (users table)
      const pendingUsersResult = await pool.query(
        "SELECT id, email, role, created_at FROM users WHERE approval_status = 'pending'"
      );
      
      // Get pending DPCs (district_placement_cells table)
      const pendingDpcsResult = await pool.query(
        "SELECT id, official_email AS email, 'dpc' AS role, created_at FROM district_placement_cells WHERE approval_status = 'pending'"
      );

      const combined = [
        ...pendingUsersResult.rows,
        ...pendingDpcsResult.rows
      ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        data: combined
      });
    } catch (error) {
      next(error);
    }
  },

  approveAccount: async (req, res, next) => {
    try {
      const { id, role } = req.body; // e.g. { id: 5, role: 'dpc' }
      
      if (!id || !role) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({ success: false, message: "ID and role required" });
      }

      if (role === 'dpc') {
        const updateDpc = await pool.query(
          "UPDATE district_placement_cells SET approval_status = 'approved' WHERE id = $1 RETURNING id",
          [id]
        );
        if (updateDpc.rowCount === 0) return res.status(STATUS_CODES.NOT_FOUND).json({ success: false, message: "DPC not found" });
      } else {
        const updateUser = await pool.query(
          "UPDATE users SET approval_status = 'approved' WHERE id = $1 RETURNING id",
          [id]
        );
        if (updateUser.rowCount === 0) return res.status(STATUS_CODES.NOT_FOUND).json({ success: false, message: "User not found" });
      }

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: "Account approved successfully"
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = adminController;
