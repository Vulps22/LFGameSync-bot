const { DataTypes, Model } = require('sequelize');
const sequelize = require('../utils/sequelize.js');
/**
 * @typedef {Object} FailedJobAttributes
 * @property {number} id
 * @property {string} uuid
 * @property {string} connection
 * @property {string} queue
 * @property {string} payload
 * @property {string} exception
 * @property {Date} failedAt
 */

/**
 * @typedef {Model<FailedJobAttributes>} FailedJobInstance
 */

/**
 * @class FailedJob
 * @extends Model
 */
class FailedJob extends Model {}

// Initialize the FailedJob model
FailedJob.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    uuid: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    connection: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    queue: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    payload: {
      type: DataTypes.LONGTEXT,
      allowNull: false,
    },
    exception: {
      type: DataTypes.LONGTEXT,
      allowNull: false,
    },
    failedAt: {
      type: DataTypes.TIMESTAMP,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'FailedJob',
    tableName: 'failed_jobs',
    timestamps: true, // Uses `created_at` & `updated_at` (but you can modify it based on the actual DB)
    underscored: true, // Ensures Sequelize uses snake_case in DB
  }
);

module.exports = FailedJob;
