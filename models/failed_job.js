const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Assuming you have a configured sequelize instance
const { underscore } = require('discord.js');

const FailedJob = sequelize.define('FailedJob', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  uuid: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  connection: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  queue: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  payload: {
    type: DataTypes.LONGTEXT,
    allowNull: false
  },
  exception: {
    type: DataTypes.LONGTEXT,
    allowNull: false
  },
  failedAt: {
    type: DataTypes.TIMESTAMP,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'failed_jobs',  // Ensures the model maps to the correct table
  timestamps: true,  // Disable automatic timestamps since the table doesn't have created_at/updated_at columns
  underscored: true  // Ensures Sequelize uses snake_case in DB
});

module.exports = FailedJob;
