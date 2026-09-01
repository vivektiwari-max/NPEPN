const express = require("express");
const authController = require("../controllers/auth.controller");
const { verifyToken } = require("../middleware/auth.middleware");

const router = express.Router();

// Public routes
router.post("/login", authController.login);

// Protected routes
router.post("/logout", verifyToken, authController.logout);
router.get("/me", verifyToken, authController.getCurrentUser);
router.post("/verify-token", verifyToken, authController.verifyToken);

module.exports = router;
