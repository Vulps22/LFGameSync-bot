import { DataTypes } from 'sequelize';
import sequelize from '../utils/sequelize.js';
import User from './user.js';

const GameAccount = sequelize.define(
  'GameAccount',
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
    steamId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true,
      field: 'steam_id',
    },
    syncing: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'syncing',
    },
    lastSync: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'last_sync',
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
    tableName: 'game_accounts',
    timestamps: true,
    underscored: true,
  }
);

GameAccount.belongsTo(User);

export default GameAccount;
