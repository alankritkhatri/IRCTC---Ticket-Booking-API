const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const auth = require("../middleware/auth");

router.post("/book", auth, bookingController.bookSeat);
router.get("/:bookingId", auth, bookingController.getBookingDetails);

module.exports = router;
