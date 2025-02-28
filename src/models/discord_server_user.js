const { DataTypes, Model } = require('sequelize');
const sequelize = require('../utils/sequelize.js'); // Assuming you have a configured sequelize instance

/**
 * @typedef {Object} DiscordServerUserAttributes
 * @property {number} id
 * @property {string} serverId
 * @property {string} userId
 * @property {boolean} shareLibrary
 * @property {boolean} shouldDelete
 * @property {Date} [createdAt]
 * @property {Date} [updatedAt]
 */

/**
 * @typedef {Model<DiscordServerUserAttributes>} DiscordServerUserInstance
 */

/**
 * @class DiscordServerUser
 * @extends Model
 */
class DiscordServerUser extends Model {

  static associate(db) {
    DiscordServerUser.belongsTo(db.User, {
      foreignKey: 'userId',
      as: 'user',
    });
    DiscordServerUser.belongsTo(db.DiscordServer, {
      foreignKey: 'serverId',
      as: 'server',
    });
  }

}

// Initialize the DiscordServerUser model
DiscordServerUser.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    serverId: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    userId: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    shareLibrary: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    shouldDelete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
    modelName: 'DiscordServerUser',
    tableName: 'discord_server_users',
    timestamps: true, // Ensures Sequelize uses `created_at` & `updated_at`
    underscored: true, // Ensures Sequelize uses snake_case in DB
  }
);

module.exports = DiscordServerUser;
