const { DataTypes, Model } = require('sequelize');
const sequelize = require('../utils/sequelize.js');

/**
 * @typedef {Object} PersonalAccessTokenAttributes
 * @property {number} id
 * @property {string} tokenableType
 * @property {number} tokenableId
 * @property {string} name
 * @property {string} token
 * @property {string} abilities
 * @property {Date} lastUsedAt
 * @property {Date} expiresAt
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * @typedef {Model<PersonalAccessTokenAttributes>} PersonalAccessTokenInstance
 */

/**
 * @class PersonalAccessToken
 * @extends Model
 */
class PersonalAccessToken extends Model {
}

PersonalAccessToken.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    tokenableType: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'tokenable_type',
    },
    tokenableId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'tokenable_id',
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: true,
    },
    abilities: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    lastUsedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'last_used_at',
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'expires_at',
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
    modelName: 'PersonalAccessToken',
    tableName: 'personal_access_tokens',
    timestamps: true,
    underscored: true, // Ensures Sequelize uses snake_case in DB
  }
);

module.exports = PersonalAccessToken;
