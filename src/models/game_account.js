const { DataTypes, Model } = require('sequelize');
const sequelize = require('../utils/sequelize.js');
const User = require('./user.js');

/**
 * @typedef {Object} GameAccountAttributes
 * @property {number} id
 * @property {number} userId
 * @property {string} [steamId]
 * @property {boolean} syncing
 * @property {Date} [lastSync]
 * @property {Date} [createdAt]
 * @property {Date} [updatedAt]
 */

/**
 * @typedef {Model<GameAccountAttributes>} GameAccountInstance
 */

/**
 * @class GameAccount
 * @extends Model
 */
class GameAccount extends Model {

  static associate(db) {
    GameAccount.belongsTo(db.User, {
      foreignKey: 'userId',
      as: 'user',
    });
  }

}

// Initialize the GameAccount model
GameAccount.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'user_id',
    },
    steamId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true,
      field: 'steam_id',
    },
    syncing: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'syncing',
    },
    lastSync: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'last_sync',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'created_at',
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'updated_at',
    },
  },
  {
    sequelize,
    modelName: 'GameAccount',
    tableName: 'game_accounts',
    timestamps: true, // Uses `created_at` & `updated_at`
    underscored: true, // Ensures Sequelize uses snake_case in DB
  }
);

module.exports = GameAccount;
