const { Sequelize } = require("sequelize");
const sequelize = new Sequelize("database.db", null, null, {
  dialect: "sqlite",
  host: "./database.sqlite",
  logging: false
});

module.exports = sequelize;
