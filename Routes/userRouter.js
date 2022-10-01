const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { validateToken } = require("../jwt");

const router = express.Router();
const {
  getUsers,
  deleteUsers,
  adminUpdateUser,
} = require("../Controllers/userController");
//Routes list
router.get("/all", authMiddleware, validateToken, getUsers);
//When admin is updating we must check their roles
router.patch(
  "/admin-update/:id",
  authMiddleware,
  validateToken,
  adminUpdateUser
);
router.delete("/all", authMiddleware, deleteUsers);

module.exports = router;
