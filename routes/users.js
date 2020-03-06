const config = require("config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validate } = require("../models/user");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

// for create a new user
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  user = new User(_.pick(req.body, ["name", "email", "password"]));

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  // _.pick select a object and the elements thats
  // you whant returns about this object in a
  // new object
  const token = jwt.sign(
    {
      _id: user._id
    },
    config.get("jwtPrivateKey")
  );
  // res.send(token);
  res.header("x-auth-token", token).send(_.pick(user, ["name", "email"]));
});

module.exports = router;
