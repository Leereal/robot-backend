const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
const {
  getSignals,
  getSignal,
  createSignal,
  updateSignal,
  deleteSignal,
  deleteSignals,
  //   filterSignals,
} = require("../Controllers/signalController");

//Routes list
router.post("/", createSignal);

router.get("/", getSignals);

router.get("/:id", getSignal);

router.patch("/:id", updateSignal);

router.delete("/:id", deleteSignal);

router.delete("/", deleteSignals);

// router.get('/query', filterSignals);

module.exports = router;
