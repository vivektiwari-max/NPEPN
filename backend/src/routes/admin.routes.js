const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const { verifyToken, checkRole } = require("../middleware/auth.middleware");

// GET /api/admin/pending
router.get("/pending", verifyToken, checkRole("admin"), adminController.getPendingAccounts);

// PATCH /api/admin/approve
router.patch("/approve", verifyToken, checkRole("admin"), adminController.approveAccount);

module.exports = router;
