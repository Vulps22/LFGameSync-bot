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
   * 
   * @param {Model[]} db 
   */
  static associate = (db) => {
    console.log(db);
    User.belongsToMany(db.DiscordServer, { through: 'DiscordServerUser' });
    User.hasMany(db.Game, { through: 'GameUser' });
    User.hasMany(db.LinkToken);
    User.hasMany(db.GameAccount);
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
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
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
