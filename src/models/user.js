import { DataTypes, Model } from 'sequelize';
import sequelize from '../utils/sequelize.js';
import Game from './game.js';
import LinkToken from './link_token.js';
import GameAccount from './game_account.js';

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    discordId: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: true,
    },
    discordName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: 'Name Retrieval Failed - This is an error',
    },
    discordAccessToken: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    discordTokenExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    discordRefreshToken: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users', // Ensure this matches your actual table name
    timestamps: true, // Set to true if you want Sequelize to manage created_at/updated_at
    underscored: true, // If your table uses snake_case column names
  }
);

User.belongsToMany(DiscordServer, { through: 'DiscordServerUser' });
User.hasMany(Game, { through: 'GameUser' });
User.hasMany(LinkToken);
User.hasMany(GameAccount);

export default User;
