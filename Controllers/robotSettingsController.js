const Signal = require('../Models/Signal');
const TradeSettings = require('../Models/TradeSettings');
const { getRobotSettings, deactivateRobot } = require('./functions');
const jwt = require('jsonwebtoken');
const robot = require('../Robots/robot');
//Main Work
const { Socket } = require('../utils/socket');

const setRobot = async (req, res) => {
  const data = 'formData' in req.body ? req.body.formData : req.body;
  try {
    const settings = await TradeSettings.create(data);
    res.status(201).json({ message: 'Successfully saved', settings });
  } catch (error) {
    console.log(error);
  }
};
const unsetRobot = async (req, res) => {
  try {
    const settings = await TradeSettings.findOne({
      where: { id: req.params.id },
    });
    settings.active = req.body.active;
    await settings.save();
    res.status(201).json({ message: 'Deactivated Successfully' });
  } catch (error) {
    console.log(error);
  }
};
const update = async (req, res) => {
  const data = 'formData' in req.body ? req.body.formData : req.body;
  try {
    const settings = await getRobotSettings(req.params.id);
    settings.account_name = data.account_name;
    settings.token = data.token;
    settings.payout = data.payout;
    settings.stake = data.stake;
    settings.expiration = data.expiration;
    settings.current_level = data.current_level;
    settings.martingale = data.martingale;
    settings.target_percentage = data.target_percentage;
    settings.currency = data.currency;
    await settings.save();
    res.status(200).json({ settings });
  } catch (error) {
    console.log(error);
  }
};
const all = async (req, res) => {
  try {
    const settings = await TradeSettings.findAll();
    res.status(200).json({ settings });
  } catch (error) {
    console.log(error);
  }
};
const view = async (req, res) => {
  try {
    const settings = await getRobotSettings(req.params.id);
    res.status(200).json({ settings });
  } catch (error) {
    console.log(error);
  }
};
const startServer = async (req, res) => {
  try {
    robot.startServer();
    res.status(200).json({ message: 'Server successfully started' });
  } catch (error) {
    console.log(error);
  }
};
const stopServer = async (req, res) => {
  try {
    robot.stopServer();
    res.status(200).json({ message: 'Server successfully stopped' });
  } catch (error) {
    console.log(error);
  }
};
const startBot = async (req, res) => {
  try {
    const settings = await TradeSettings.findOne({
      where: { id: req.body.id },
    });
    settings.active = true;
    await settings.save();
    // robot.startServer();
    res
      .status(200)
      .json({ message: 'Robot successfully started', active: false });
  } catch (error) {
    console.log(error);
  }
};
const stopBot = async (req, res) => {
  try {
    await deactivateRobot(req.body.id);
    res
      .status(200)
      .json({ message: 'Robot successfully stopped', active: false });
  } catch (error) {
    console.log(error);
  }
};
const signalRobot = async (req, res) => {
  console.log('Signal received');
  res.status(200).json({ message: 'These are robots' });
};
module.exports = {
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
};
