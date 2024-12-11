const db = require("../config/database");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const adminAuth = async (req, res, next) => {
  try {
    const secret = process.env.JWT_SECRET;
    const apiKey = req.header("X-API-KEY");
    const token = req.header("Authorization")?.replace("Bearer ", "");
    const decoded = jwt.verify(token, secret);
    console.log(decoded);
    const role = decoded.role;
    if (apiKey !== process.env.ADMIN_API_KEY || role != "admin") {
      throw new Error();
    }
    next();
  } catch {
    res.status(401).send({ error: "Not authorized as admin." });
  }
};

module.exports = adminAuth;
