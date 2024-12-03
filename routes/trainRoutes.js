const express = require("express");
const router = express.Router();
const trainController = require("../controllers/trainController");
const auth = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");
router.post("/add", adminAuth, trainController.addTrain);
router.get("/availability", trainController.getAvailability);

module.exports = router;
