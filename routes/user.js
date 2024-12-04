const express = require("express");
const router = express.Router();
const path = require("path");
const userController = require("../controllers/user");
const userAuthentication = require("../middleware/auth");

router.post("/signUp", userController.addUser);
router.post("/logIn", userController.logIn);
router.post("/profile", userAuthentication, userController.updateUserProfile);

module.exports = router;
