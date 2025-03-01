'use strict';
const { Model, DataTypes } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Config extends Model {
    static associate(models) {
      // define associations here if needed
    }

    static async getConfig() {
      return await this.findOne({
        where: {
          env: process.env.NODE_ENV,
        }
      });
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
    baseURL: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    linkBaseURL: {
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
  });
  return Config;
};
