const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const token = await req.headers.authorization.split(" ")[1];
    const verifyToken = await jwt.verify(token, process.env.SECRET_KEY);
    const user = await verifyToken;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      error: new Error("Invalid request!"),
    });
  }
};
