const adminAuth = async (req, res, next) => {
  try {
    const apiKey = req.header("X-API-KEY");
    if (apiKey !== process.env.ADMIN_API_KEY) {
      throw new Error();
    }
    next();
  } catch {
    res.status(401).send({ error: "Not authorized as admin." });
  }
};

module.exports = adminAuth;
