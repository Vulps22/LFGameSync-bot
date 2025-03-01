const { DataTypes, Model } = require('sequelize');
const sequelize = require('../utils/sequelize.js');
const User = require('./user.js'); // Assuming the User model is already defined

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
    DiscordServer.belongsToMany(db.User, {
      through: db.DiscordServerUser,  // Use the actual model, not just a string
      foreignKey: 'serverId',  // Explicitly specify the foreign key for the DiscordServer
      otherKey: 'userId',      // Explicitly specify the foreign key for the User
    });
    
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
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
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
