const { DataTypes, Model } = require('sequelize');
const sequelize = require('../utils/sequelize.js');
const { User, GameUser } = require('./');
const { default: SteamAPI } = require('steamapi');

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

  /**
 * Get the user's game library and sync it with the database
 */
  async sync() {

    const { GameUser, Game } = require('./'); // Import here to avoid circular dependency


    const steam = new SteamAPI(process.env.STEAM_API_KEY);

    /** @type { User } */
    const user = await this.getUser();

    // Fetch user's current games in the database
    const userGames = await user.getGames({ attributes: ['id', 'gameId'] });

    // Get Steam games
    const steamGames = await steam.getUserOwnedGames(this.steamId, {
      includeAppInfo: true,
      includeFreeGames: true
    });

    // Convert Steam's game list into a Set for quick lookup
    const steamGameIds = new Set(steamGames.map(game => game.id));

    // Find games that exist in the database but are no longer in Steam
    const gamesToRemove = userGames.filter(dbGame => !steamGameIds.has(dbGame.gameId));

    // Delete the GameUser entries for games not in Steam anymore
    if (gamesToRemove.length > 0) {
      await GameUser.destroy({
        where: {
          userId: user.id,
          gameId: gamesToRemove.map(game => game.gameId),
        },
      });
    }

    // Sync and add new games
    for (const usersGame of steamGames) {

      const [dbGame] = await Game.findOrCreate({
        where: { gameId: usersGame.game.id },
        defaults: { name: usersGame.game.name, imageUrl: usersGame.game.icon },
      });

      await user.addGame(dbGame.id);
    }
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
    modelName: 'GameAccount',
    tableName: 'game_accounts',
    timestamps: true, // Uses `created_at` & `updated_at`
    underscored: true, // Ensures Sequelize uses snake_case in DB
  }
);

module.exports = GameAccount;
