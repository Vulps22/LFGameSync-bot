const { Sequelize } = require('sequelize');
const Logger = require('./logger');
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'mysql',
  logging: false,
  //logging: Logger.debug,
});

module.exports = sequelize;
