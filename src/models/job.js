const { DataTypes, Model } = require('sequelize');
const sequelize = require('../utils/sequelize.js');

/**
 * @typedef {Object} JobAttributes
 * @property {number} id
 * @property {string} queue
 * @property {string} payload
 * @property {number} attempts
 * @property {number|null} reservedAt
 * @property {number} availableAt
 * @property {number} createdAt
 */

/**
 * @typedef {Model<JobAttributes>} JobInstance
 */

/**
 * @class Job
 * @extends Model
 */
class Job extends Model {}

Job.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    queue: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    payload: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
    attempts: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
    },
    reservedAt: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      field: 'reserved_at',
    },
    availableAt: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'available_at',
    },
    createdAt: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'created_at',
    },
  },
  {
    sequelize,
    modelName: 'Job',
    tableName: 'jobs',
    timestamps: false,
    underscored: true, // Ensures Sequelize uses snake_case in DB
  }
);

module.exports = Job;
