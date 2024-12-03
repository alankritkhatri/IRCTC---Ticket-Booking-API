const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res.status(401).json({
        error: "Please provide an authentication token",
      });
    }
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Please provide the token in the correct format (Bearer token)",
      });
    }
    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        error: "Your authentication token appears to be invalid",
      });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        error: "Your session has expired. Please log in again",
      });
    }
    res.status(500).json({
      error: "Something went wrong with the authentication process",
    });
  }
};

module.exports = auth;
