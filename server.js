const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const trainRoutes = require("./routes/trainRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const trainController = require("./controllers/trainController");
const app = express();

// Security Middleware
app.use(helmet());

// CORS
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "X-API-KEY"],
  })
);

// Middleware
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.status(200).json("welcome to irctc api");
});
app.use("/api/auth", authRoutes);
app.use("/api/trains", trainRoutes);
app.use("/api/bookings", bookingRoutes);
app.post("/api/trains/availability", trainController.getAvailability);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Error: Something went wrong" });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: "Invalid Route: 404 Not Found" });
});

// For Starting the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
