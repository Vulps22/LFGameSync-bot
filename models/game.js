import { DataTypes } from 'sequelize';
import sequelize from '../src/utils/sequelize.js';
import User from './user.js';

const Game = sequelize.define(
  'Game',
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    gameId: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'game_id',
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'image_url',
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
    tableName: 'games',
    timestamps: true, // Uses `created_at` & `updated_at`
    underscored: true, // Ensures Sequelize uses snake_case in DB
  }
);

Game.belongsToMany(User, { through: 'GameUser' });

export default Game;
