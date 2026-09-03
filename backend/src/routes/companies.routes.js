const express = require("express");
const router = express.Router();
const companiesController = require("../controllers/companies.controller");
const { verifyToken, checkRole } = require("../middleware/auth.middleware");

router.post("/register", companiesController.register);

router.get("/", verifyToken, checkRole("admin"), companiesController.getAll);

router.get("/profile", verifyToken, checkRole("company"), companiesController.getProfile);

router.put("/:id", verifyToken, checkRole("company", "admin"), companiesController.updateProfile);

router.delete("/:id", verifyToken, checkRole("admin"), companiesController.delete);

module.exports = router;
