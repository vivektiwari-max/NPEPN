const express = require("express");
const { registerDpc, loginDpc } = require("../controllers/dpc.controller"); // Ensure this matches your file name exactly
// const { authenticateToken } = require("../middleware/auth.middleware"); // You can uncomment this later for securing Dashboard endpoints

const router = express.Router();

/**
 * Route: POST /api/dpc/register
 * Purpose: Register a new District Placement Cell
 */
router.post("/register", registerDpc);

/**
 * Route: POST /api/dpc/login
 * Purpose: Authenticate DPC and return a JWT token
 */
router.post("/login", loginDpc);

module.exports = router;
