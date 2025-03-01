const { Sequelize } = require('sequelize');
const config = require('../config'); // Assuming your database config is stored here

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  port: config.port,
  dialect: 'mysql',
  logging: false,
  //logging: console.log,
});

module.exports = sequelize;
