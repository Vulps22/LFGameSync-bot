const { DataTypes, Model } = require('sequelize');
const sequelize = require('../utils/sequelize.js');

/**
 * @typedef {Object} LinkTokenAttributes
 * @property {string} token
 * @property {string} userId
 * @property {Date} expires
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * @typedef {Model<LinkTokenAttributes>} LinkTokenInstance
 */

/**
 * @class LinkToken
 * @extends Model
 */
class LinkToken extends Model {

  static associate(db) {
    LinkToken.belongsTo(db.User, {
      foreignKey: 'userId',
      as: 'user',
    });
  }

}

LinkToken.init(
  {
    token: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'user_id',
    },
    expires: {
      type: DataTypes.DATE,
      allowNull: false,
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
    modelName: 'LinkToken',
    tableName: 'link_tokens',
    timestamps: true,
    underscored: true, // Ensures Sequelize uses snake_case in DB
  }
);

module.exports = LinkToken;
