const { DataTypes, Model } = require('sequelize');
const sequelize = require('../utils/sequelize.js');

/**
 * @typedef {Object} UserAttributes
 * @property {number} id
 * @property {string} discordId
 * @property {string} discordName
 * @property {string} [discordAccessToken]
 * @property {Date} [discordTokenExpires]
 * @property {string} [discordRefreshToken]
 * @property {Date} [createdAt]
 * @property {Date} [updatedAt]
 */

/**
 * @typedef {Model<UserAttributes>} UserInstance
 */

/**
 * @class User
 * @extends Model
 */
class User extends Model {
  /**
   * @returns {Promise<UserInstance[]>}
   */
  static async findByDiscordId(discordId) {
    return await this.findAll({
      where: {
        discordId: discordId,
      },
    });
  }

  /**
   * Check if the user's GameAccount is linked to a Steam account.
   * @returns {Promise<boolean>}
   */
  async isLinked() {
    
    const gameAccount = await this.getGameAccount();
    console.log(gameAccount.toJSON());
    return gameAccount && gameAccount.steamId !== null;

  }

  /**
   * 
   * @param {Model[]} db 
   */
  static associate = (db) => {
    console.log(db);

    User.belongsToMany(db.DiscordServer, {
      through: db.DiscordServerUser,  // Use the actual model, not just a string
      foreignKey: 'userId',
      otherKey: 'serverId',
    });

    //define relationship to DiscordServerUser
    User.hasMany(db.DiscordServerUser, {
      foreignKey: 'userId',
      as: 'serverUsers',
    });
    

    User.belongsToMany(db.Game, {
      through: 'GameUser',
    });

    User.hasOne(db.GameAccount);
  };

}

User.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    discordId: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: true,
    },
    discordName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: 'Name Retrieval Failed - This is an error',
    },
    discordAccessToken: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    discordTokenExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    discordRefreshToken: {
      type: DataTypes.STRING(255),
      allowNull: true,
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
    modelName: 'User',
    tableName: 'users', // Ensure this matches your actual table name
    timestamps: true, // Set to true if you want Sequelize to manage created_at/updated_at
    underscored: true, // If your table uses snake_case column names
  }
);

module.exports = User;
