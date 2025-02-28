const { DataTypes, Model } = require('sequelize');
const sequelize = require('../utils/sequelize.js');

/**
 * @typedef {Object} GameUserAttributes
 * @property {number} id
 * @property {number} userId
 * @property {number} gameId
 * @property {Date} [createdAt]
 * @property {Date} [updatedAt]
 */

/**
 * @typedef {Model<GameUserAttributes>} GameUserInstance
 */

/**
 * @class GameUser
 * @extends Model
 */
class GameUser extends Model {

  static associate(db) {
    GameUser.hasOne(db.User, {
      foreignKey: 'userId',
      as: 'user',
    });
    GameUser.hasOne(db.Game, {
      foreignKey: 'gameId',
      as: 'game',
    });
  }

}

// Initialize the GameUser model
GameUser.init(
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
    gameId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'game_id',
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
    modelName: 'GameUser',
    tableName: 'game_users',
    timestamps: true, // Uses `created_at` & `updated_at`
    underscored: true, // Ensures Sequelize uses snake_case in DB
  }
);

module.exports = GameUser;
