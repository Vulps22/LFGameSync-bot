const { APIEmbed, APIEmbedField, EmbedBuilder, RestOrArray } = require('discord.js');

const Game = require('../interfaces/game');
const Caller = require('./caller');
const { exit } = require('process');


class EmbeddedGame {
  gameId;
  users;

  constructor(gameId) {
    this.gameId = gameId;
    this.users = [];
  }

  async fetchGameData() {
    try {
      const gameData = await Caller.getGame(this.gameId);
        const game = gameData.data;
        
      if(!game.id) throw new Error("Game ID Missing");
      if(!game.name) throw new Error("Game Name Missing");
      if(!game.image) throw new Error("Game Image Missing");
      if(!game.storeId) throw new Error("Game Store ID Missing");

      return game;

    } catch (error) {
      console.error('Error fetching game data:', error);
      return null;
    }
  }

  async buildEmbed(user) {
    const gameData = await this.fetchGameData();

    if (!gameData) {
      console.error('Game data not available.');
      return null;
    }

    if(!(gameData.id || gameData.name || gameData.storeId || gameData.image)) throw new Error('Game Data missing Information');

    const embed = new EmbedBuilder()
      .setTitle(gameData.name)
      .setDescription(`<@${user}> wants to play ${gameData.name} ${this.users.length > 0 ? 'with' : ''}`)
      
      //if there are users to tag
      if(this.users.length > 0){
        const fields = [];
        this.users.forEach(userId => {
          fields.push({name: ' ', value: `- <@${userId}>`})
        });
        embed.addFields(fields);
      }

      embed.addFields({name: 'Get The Game', value: `[Steam Store](https://store.steampowered.com/app/${gameData.storeId})`})
      .setImage(`http://cdn.cloudflare.steamstatic.com/steam/apps/${gameData.storeId}/header.jpg`)

    return embed;
  }

  addUsers(users) {
    this.users = users;
    return this;
  }

  async toJSON(user) {
    const embed = await this.buildEmbed(user);
    
    if (!embed) {
      console.error('Failed to build embed.');
      throw new Error("Failed to Embed Game: " + this.gameId);
    }

    return embed.toJSON();
  }
}

module.exports = EmbeddedGame;
