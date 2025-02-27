import { DataTypes } from 'sequelize';
import sequelize from '../utils/sequelize.js';

const Job = sequelize.define(
  'Job',
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
    tableName: 'jobs',
    timestamps: false,
    underscored: true,
  }
);

export default Job;
