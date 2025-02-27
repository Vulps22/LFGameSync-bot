import { DataTypes } from 'sequelize';
import sequelize from '../src/utils/sequelize.js';

const LinkToken = sequelize.define(
  'LinkToken',
  {
    token: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.STRING(255),
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
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'updated_at',
    },
  },
  {
    tableName: 'link_tokens',
    timestamps: true,
    underscored: true,
  }
);

export default LinkToken;
