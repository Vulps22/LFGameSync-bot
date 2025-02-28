const { DataTypes, Model } = require('sequelize');
const sequelize = require('../utils/sequelize.js');
const User = require('./user'); // Assuming the User model is already defined

/**
 * @typedef {Object} DiscordServerAttributes
 * @property {number} id
 * @property {string} discordId
 * @property {string} name
 * @property {string} [iconHash]
 * @property {Date} [createdAt]
 * @property {Date} [updatedAt]
 */

/**
 * @typedef {Model<DiscordServerAttributes>} DiscordServerInstance
 */

/**
 * @class DiscordServer
 * @extends Model
 */
class DiscordServer extends Model {

  static associate(db) {
    DiscordServer.hasMany(db.User, { through: 'DiscordServerUser' });
  }
}

// Initialize the DiscordServer model
DiscordServer.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    discordId: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    iconHash: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.TIMESTAMP,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.TIMESTAMP,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'DiscordServer',
    tableName: 'discord_servers',
    timestamps: true, // Ensures Sequelize uses `created_at` & `updated_at`
    underscored: true, // Ensures Sequelize uses snake_case in DB
  }
);

module.exports = DiscordServer;
