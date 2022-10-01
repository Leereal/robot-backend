const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database/sqlite-connect');
class TradeSettings extends Model {}
TradeSettings.init(
  {
    member_id: { type: DataTypes.INTEGER, defaultValue: 1 },
    robot_id: { type: DataTypes.INTEGER },
    account_name: { type: DataTypes.STRING },
    token: { type: DataTypes.STRING },
    payout: { type: DataTypes.REAL },
    stake: { type: DataTypes.REAL },
    expiration: { type: DataTypes.INTEGER },
    current_level: { type: DataTypes.INTEGER },
    martingale: { type: DataTypes.TINYINT(1), defaultValue: false },
    target_percentage: { type: DataTypes.REAL },
    active: { type: DataTypes.TINYINT(1), defaultValue: false },
    balance: { type: DataTypes.REAL, defaultValue: 0 },
    target_reached: { type: DataTypes.TINYINT(1), defaultValue: false },
    open_trade: { type: DataTypes.TINYINT(1), defaultValue: false },
    active_contract_id: { type: DataTypes.INTEGER, defaultValue: 0 },
    last_profit: { type: DataTypes.REAL, defaultValue: 0 },
    entry: { type: DataTypes.STRING, defaultValue: '' },
  },
  { sequelize, modelName: 'trade_settings' }
);
TradeSettings.associate = (models) => {
  TradeSettings.belongsTo(models.Robot);
};
module.exports = TradeSettings;
