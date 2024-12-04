const users = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//require('dotenv').config()

require("dotenv").config();
const sequelize = require("../utils/database");

function generateAccessToken(id, email) {
  return jwt.sign({ userId: id, email: email }, process.env.TOKEN, {
    expiresIn: "1h",
  });
}
//console.log(process.env.TOKEN);

exports.addUser = async (req, res, next) => {
  console.log(req.body);
  try {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    bcrypt.hash(password, 10, async (err, hash) => {
      await users
        .create({
          name: name,
          email: email,
          password: hash,
        })
        .then((result) => {
          console.log("User Added");
          res.status(201).json(result);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  } catch (error) {
    console.log(error);
  }
};

exports.logIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await users.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // const token = jwt.sign(
    //   { userId: user.id, email: user.email },
    //   process.env.TOKEN,
    //   { expiresIn: "1h" }
    // );

    res.status(200).json({
      message: "Login successful",
      token: generateAccessToken(user.id, user.email),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.updateUserProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;

    // `req.user` is set by the authenticate middleware
    const user = req.user;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user profile fields only if provided
    user.name = name || user.name;
    user.email = email || user.email;

    await user.save(); // Save changes to the database

    res.status(200).json({
      message: "Profile updated successfully",
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
