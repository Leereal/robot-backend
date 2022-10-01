const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
const {
  getRobots,
  getRobot,
  createRobot,
  updateRobot,
  deleteRobot,
} = require("../Controllers/robotController");

//Routes list
router.post("/", createRobot);

router.get("/", getRobots);

router.get("/:id", getRobot);

router.patch("/:id", updateRobot);

router.delete("/:id", deleteRobot);

module.exports = router;
