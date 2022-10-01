const { Model, DataTypes } = require("sequelize");
const sequelize = require("../database/sqlite-connect");
class Robot extends Model {}
Robot.init(
  {
    name: { type: DataTypes.STRING },
    version: { type: DataTypes.STRING },
    strategy: { type: DataTypes.STRING },
    active: { type: DataTypes.TINYINT(1) },
  },
  { sequelize, modelName: "robots" }
);
// Robot.associate = (models) => {
//   Robot.hasMany(models.TradeSettings, { foreignKey: "robot_id", as: "robs" });
// };
module.exports = Robot;
