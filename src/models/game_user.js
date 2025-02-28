const { DataTypes, Model } = require('sequelize');
const sequelize = require('../utils/sequelize.js');

/**
 * @typedef {Object} GameUserAttributes
 * @property {bigint} game_id
 * @property {bigint} user_id
 * @property {Date} created_at
 * @property {Date} updated_at
 */

/**
 * @typedef {Model<GameUserAttributes>} GameUserInstance
 */

/**
 * @class GameUser
 * @extends Model
 */
class GameUser extends Model {
  /**
   * Define model associations
   * @param {Object} db - Sequelize models
   */
  static associate(db) {
    GameUser.belongsTo(db.User, {
      foreignKey: 'user_id',
      as: 'user',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    GameUser.belongsTo(db.Game, {
      foreignKey: 'game_id',
      as: 'game',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  }
}

// Initialize the GameUser model
GameUser.init(
  {
    game_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'GameUser',
    tableName: 'game_users',
    timestamps: true, // Uses `created_at` & `updated_at`
    underscored: true, // Ensures snake_case in DB
  }
);

module.exports = GameUser;
