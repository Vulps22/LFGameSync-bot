import { DataTypes } from 'sequelize';
import sequelize from '../src/utils/sequelize.js';

const GameUser = sequelize.define(
  'GameUser',
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
    gameId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'game_id',
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
    tableName: 'game_users',
    timestamps: true,
    underscored: true,
  }
);

export default GameUser;
