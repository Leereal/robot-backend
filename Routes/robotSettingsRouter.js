const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
const {
  setRobot,
  unsetRobot,
  startBot,
  stopBot,
  startServer,
  stopServer,
  signalRobot,
  all,
  view,
  update,
} = require("../Controllers/robotSettingsController");

//Routes list
router.get("/", all);

router.get("/:id", view);

router.patch("/edit/:id", update);

router.post("/set", setRobot);

router.patch("unset/:id", unsetRobot);

router.patch("/start", startBot);

router.patch("/stop", stopBot);

router.post("/start-server", authMiddleware, startServer);

router.post("/stop-server", stopServer);

router.post("/signal", signalRobot);

module.exports = router;
