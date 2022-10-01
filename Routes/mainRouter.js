const express = require("express");

const router = express.Router();
const {
  login,
  register,
  changePassword,
} = require("../Controllers/mainController");
//Routes list
router.post("/login", login);

router.post("/register", register);

router.patch("/change-password/:id", changePassword);

module.exports = router;
