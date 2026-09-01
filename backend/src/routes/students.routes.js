const express = require("express");
const studentsController = require("../controllers/students.controller");
const { verifyToken, checkRole } = require("../middleware/auth.middleware");

const router = express.Router();

// Public routes
router.post("/", studentsController.register);
router.get("/search/college", studentsController.searchByCollege);
router.get("/search/district", studentsController.getByDistrict);

// Protected routes
router.get("/", studentsController.getAll); // Public for testing
router.get(
  "/profile",
  verifyToken,
  checkRole("student", "admin"),
  studentsController.getProfile,
);

router.put(
  "/:id",
  verifyToken,
  checkRole("student", "admin"),
  studentsController.updateProfile,
);
router.delete(
  "/:id",
  verifyToken,
  checkRole("student", "admin"),
  studentsController.delete,
);

module.exports = router;
