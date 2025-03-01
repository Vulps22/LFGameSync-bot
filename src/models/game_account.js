const { DataTypes, Model } = require('sequelize');
const sequelize = require('../utils/sequelize.js');
const { User, GameUser } = require('./');

let SteamAPI;
(async () => {
  SteamAPI = (await import('steamapi')).default;
})();


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
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  }

  /**
   * Get the user's game library and sync it with the database.
   * Tracks the number of games removed, created, and added.
   * @returns {Promise<{ removed: number, created: number, added: number }>}
   */
  async sync() {
    const { GameUser, Game } = require('./'); // Import here to avoid circular dependency
    const steam = new SteamAPI(my.steamApiKey);
    /** @type {User} */
    const user = await this.getUser();

    // Fetch user's current game associations from the database.
    const userGames = await user.getGames({ attributes: ['id', 'gameId'] });

    // Get user's owned games from Steam.
    const steamGames = await steam.getUserOwnedGames(this.steamId, {
      includeAppInfo: true,
      includeFreeGames: true
    });

    // Convert Steam's game list into a Set of game IDs for quick lookup.
    const steamGameIds = new Set(steamGames.map(game => game.id));

    // Identify associations in the DB that are no longer in Steam.
    const gamesToRemove = userGames.filter(dbGame => !steamGameIds.has(dbGame.gameId));
    const removedCount = gamesToRemove.length;

    // Delete GameUser entries for games not in Steam anymore.
    if (removedCount > 0) {
      await GameUser.destroy({
        where: {
          userId: user.id,
          gameId: gamesToRemove.map(game => game.gameId)
        },
      });
    }

    // Recalculate user's associated game IDs after removals.
    const updatedUserGames = await user.getGames({ attributes: ['id', 'gameId'] });
    const currentGameIds = new Set(updatedUserGames.map(game => game.gameId));

    let createdCount = 0;
    let addedCount = 0;

    // Loop through Steam games and sync them.
    for (const usersGame of steamGames) {
      const steamGameId = usersGame.game.id;
      // Find or create the game in the database.
      const [dbGame, created] = await Game.findOrCreate({
        where: { gameId: steamGameId },
        defaults: { name: usersGame.game.name, imageUrl: usersGame.game.icon },
      });

      if (created) {
        createdCount++;
      }
      // If the game isn't already associated with the user, add it.
      if (!currentGameIds.has(steamGameId)) {
        await user.addGame(dbGame.id);
        addedCount++;
      }
    }

    // Optionally, return an object with the change counts.
    return {
      removed: removedCount,
      created: createdCount,
      added: addedCount,
    };
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
