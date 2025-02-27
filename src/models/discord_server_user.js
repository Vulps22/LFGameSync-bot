const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Assuming you have a configured sequelize instance

const DiscordServerUser = sequelize.define('DiscordServerUser', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  serverId: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  userId: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  shareLibrary: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: 0
  },
  shouldDelete: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: 0
  },
  createdAt: {
    type: DataTypes.TIMESTAMP,
    allowNull: true,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.TIMESTAMP,
    allowNull: true,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'discord_server_users',  // Ensures the model maps to the correct table
  timestamps: true,  // Ensures Sequelize uses createdAt and updatedAt
  underscored: true, // Ensures Sequelize uses snake_case for column names
});

module.exports = DiscordServerUser;
