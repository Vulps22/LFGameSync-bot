import { APIEmbed, APIEmbedField, EmbedBuilder, RestOrArray } from 'discord.js';

import Game from '../interfaces/game';
import Caller from '../utils/caller';
import { exit } from 'process';

class EmbeddedGame {
  private gameId: string;
  private users: string[];

  constructor(gameId: string) {
    this.gameId = gameId;
    this.users = [];
  }

  async fetchGameData(): Promise<Game | null> {
    try {
      const gameData = await Caller.getGame(this.gameId);
        const game = gameData.data as Game;
        
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

  async buildEmbed(user: string): Promise<EmbedBuilder | null> {
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
        const fields: RestOrArray<APIEmbedField> = [];
        this.users.forEach(userId => {
          fields.push({name: ' ', value: `- <@${userId}>`})
        });
        embed.addFields(fields);
      }

      embed.addFields({name: 'Get The Game', value: `[Steam Store](https://store.steampowered.com/app/${gameData.storeId!})`})
      .setImage(`http://cdn.cloudflare.steamstatic.com/steam/apps/${gameData.storeId}/header.jpg`)

    return embed;
  }

  addUsers(users: string[]): EmbeddedGame {
    this.users = users;
    return this;
  }

  async toJSON(user: string): Promise<APIEmbed> {
    const embed = await this.buildEmbed(user);
    
    if (!embed) {
      console.error('Failed to build embed.');
      throw new Error("Failed to Embed Game: " + this.gameId);
    }

    return embed.toJSON();
  }
}

export default EmbeddedGame;
