const express = require("express");
const collegesController = require("../controllers/colleges.controller");
const { verifyToken, checkRole } = require("../middleware/auth.middleware");

const router = express.Router();

// Public routes
router.post("/register", collegesController.register);
router.get("/", collegesController.getAll);
router.get("/search", collegesController.search);

// Protected routes
router.get("/:college_id", verifyToken, collegesController.getProfile);
router.put(
  "/:college_id",
  verifyToken,
  checkRole("college", "admin"),
  collegesController.updateProfile,
);
router.delete(
  "/:college_id",
  verifyToken,
  checkRole("college", "admin"),
  collegesController.delete,
);

module.exports = router;
