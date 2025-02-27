import { DataTypes } from 'sequelize';
import sequelize from '../utils/sequelize.js';

const UserToken = sequelize.define(
  'UserToken',
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
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'updated_at',
    },
  },
  {
    tableName: 'user_tokens',
    timestamps: true, // Uses `created_at` & `updated_at`
    underscored: true, // Ensures Sequelize uses snake_case in DB
  }
);

export default UserToken;
