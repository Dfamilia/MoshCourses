const jwt = require("jsonwebtoken");
// const config = require('config') //ISSUES: on windows environment

module.exports = function auth(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied. No token provided.");

  // if this token is not valid throw a Exception.
  try {
    const decoded = jwt.verify(token, "secureKey");
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).send("Invalid token.");
  }
};
