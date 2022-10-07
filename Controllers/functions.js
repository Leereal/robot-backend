const Robot = require('../Models/Robot');
const TradeSettings = require('../Models/TradeSettings');
const getRobotSettings = async (id) => {
  const settings = await TradeSettings.findOne({ where: { id: id } });
  return settings;
};
const deactivateRobot = async (id) => {
  try {
    const settings = await TradeSettings.findOne({
      where: { id: id },
    });
    settings.active = false;
    await settings.save();
  } catch (error) {
    console.log(error);
  }
};
const updateRobotSettings = async (id, field, value) => {
  try {
    const settings = await TradeSettings.findOne({
      where: { id: id },
    });
    settings[field] = value;
    await settings.save();
  } catch (error) {
    console.log(error);
  }
};
const startBotServer = async (id) => {
  try {
    const robot = await Robot.findOne({
      where: { id: id },
    });
    robot.active = true;
    await robot.save();
  } catch (error) {
    console.log(error);
  }
};
const stopBotServer = async (id) => {
  try {
    const robot = await Robot.findOne({
      where: { id: id },
    });
    robot.active = false;
    await robot.save();
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  getRobotSettings,
  deactivateRobot,
  updateRobotSettings,
  startBotServer,
  stopBotServer,
};
