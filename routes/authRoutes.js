const express = require("express");

const router =  express.Router();
const authController = require("../controllers/authController");
const auth = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/profile", auth, (req, res) => {});
router.get("/admin-dashboard", adminAuth, (req, res) => {});

module.exports = router;
