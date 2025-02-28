const { DataTypes, Model } = require('sequelize');
const sequelize = require('../utils/sequelize.js');

/**
 * @typedef {Object} UserTokenAttributes
 * @property {number} id
 * @property {number} userId
 * @property {string} token
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * @typedef {Model<UserTokenAttributes>} UserTokenInstance
 */

/**
 * @class UserToken
 * @extends Model
 */
class UserToken extends Model {

  static associate(db) {
    UserToken.belongsTo(db.User, {
      foreignKey: 'userId',
      as: 'user',
    });
  }
}

UserToken.init(
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
    token: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
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
    modelName: 'UserToken',
    tableName: 'user_tokens', // Ensure this matches your actual table name
    timestamps: true, // Set to true if you want Sequelize to manage created_at/updated_at
    underscored: true, // If your table uses snake_case column names
  }
);

module.exports = UserToken;
