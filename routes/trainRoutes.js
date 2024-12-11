const express = require("express");
const router = express.Router();
const trainController = require("../controllers/trainController");
const auth = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");
router.post("/add", adminAuth, trainController.addTrain);
router.post("/availability", trainController.getAvailability);
router.get("/availability/all", trainController.getAvailabilityAll);

module.exports = router;
