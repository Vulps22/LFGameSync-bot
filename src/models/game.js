const { DataTypes, Model, Op } = require('sequelize');
const sequelize = require('../utils/sequelize.js');
const User = require('./user.js');

/**
 * @typedef {Object} GameAttributes
 * @property {number} id
 * @property {string} gameId
 * @property {string} name
 * @property {string} imageUrl
 * @property {Date} [createdAt]
 * @property {Date} [updatedAt]
 */

/**
 * @typedef {Model<GameAttributes>} GameInstance
 */

/**
 * @class Game
 * @extends Model
 */
class Game extends Model {
  /**
   * Find all games that are similar to the name
   * i.e. spa - would find "Space Invaders" or "Space Engineers" or "Spa Simulator"
   * @param {string} name
   * @returns {Promise<GameInstance[]>}
   */
  static async search(name) {
    return await this.findAll({
      where: {
        name: {
          [Op.like]: `%${name}%`, // LIKE %name%
        },
      },
      limit: 20,
    });
  }

  getSteamURL() {
    return `https://store.steampowered.com/app/${this.gameId}`;
  }

  static associate = (db) => {
    Game.belongsToMany(db.User, { through: 'GameUser' });
  }
}

// Initialize the Game model
Game.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    gameId: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'game_id',
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'image_url',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'created_at',
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'updated_at',
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Game',
    tableName: 'games',
    timestamps: true, // Uses `created_at` & `updated_at`
    underscored: true, // Ensures Sequelize uses snake_case in DB
  }
);


module.exports = Game;
