const jwt = require("jsonwebtoken");
const config = require("config");

module.export = function(req, res, next) {
  // wait a token on header of responsed page
  const token = req.header("x-auth-token");
  if (!token) res.status(401).send("Access denied. No token provided.");

  //   if verified when your match it with the private key, return a payload
  //  if was false return a error so:
  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    console.log(decoded);
    req.user = decoded;
    next();
  } catch (e) {
    res.status(400).send("Invalid Token.");
  }
};

// module.exports = auth;
