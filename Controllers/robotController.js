const Signal = require("../Models/Signal");
const Robot = require("../Models/Robot");
const jwt = require("jsonwebtoken");
const robot = require("../Robots/robot");

//Main Work
const { Socket } = require("../utils/socket");

const getRobots = async (req, res) => {
  try {
    const robots = await Robot.findAll();
    res.status(200).json({ robots });
  } catch (error) {
    console.log(error);
  }
};
const getRobot = async (req, res) => {
  try {
    const robot = await Robot.findOne({ where: { id: req.params.id } });
    res.status(200).json({ robot });
  } catch (error) {
    console.log(error);
  }
};
const createRobot = async (req, res) => {
  try {
    await Robot.create(req.body);
    res.status(200).json({ message: "Successfully saved" });
  } catch (error) {
    console.log(error);
  }
};
const updateRobot = async (req, res) => {
  try {
    const robot = await Robot.findOne({
      where: { id: req.params.id },
    });
    robot.name = req.body.name;
    robot.version = req.body.version;
    robot.startegy = req.body.strategy;
    robot.active = req.body.active;
    await robot.save();
    res.status(200).json({ robot });
  } catch (error) {
    console.log(error);
  }
};
const deleteRobot = async (req, res) => {
  res.status(200).json({ message: "These are robots" });
};
module.exports = {
  getRobots,
  getRobot,
  createRobot,
  updateRobot,
  deleteRobot,
};
