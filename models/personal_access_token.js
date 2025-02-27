import { DataTypes } from 'sequelize';
import sequelize from '../src/utils/sequelize.js';

const PersonalAccessToken = sequelize.define(
  'PersonalAccessToken',
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
    tableName: 'personal_access_tokens',
    timestamps: true,
    underscored: true,
  }
);

export default PersonalAccessToken;
