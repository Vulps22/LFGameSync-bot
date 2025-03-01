'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../utils/sequelize.js'); // Assuming you have a configured sequelize instance


class Config extends Model {
  static associate(models) {
    // define associations here if needed
  }

  static async getConfig() {
    const config = await this.findOne({
      where: {
        env: process.env.NODE_ENV,
      }
    });

    if (!config) {
      throw new Error('Config not found for environment', process.env.NODE_ENV);
    }

    return config;

  }
}
Config.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  clientId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  baseUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  linkBaseUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  steamApiKey: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  discordLogChannelId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  discordErrorChannelId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  discordServerChannelId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  discordSupportServerId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  env: {
    type: DataTypes.ENUM('prod', 'dev', 'stage', 'test'),
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Config',
  // If you prefer snake_case in the database, uncomment the line below:
  underscored: true,
  timestamps: false,
});

module.exports = Config;
