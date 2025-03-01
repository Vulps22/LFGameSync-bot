const { EmbedBuilder } = require('discord.js');
const Game = require('../models/game'); // Import Game model

class EmbeddedGame {
  constructor(gameId) {
    this.gameId = gameId;
  }

  async buildEmbed(user) {
    // Load the game from the database instead of an external API
    const game = await Game.findOne({ where: { id: this.gameId } });

    if (!game) {
      console.log(`Game not found in database: ${this.gameId}`);
      return null;
    }

    const embed = new EmbedBuilder()
      .setTitle(game.name)
      .setDescription(`<@${user}> wants to play ${game.name}`)
      .setImage(`http://cdn.cloudflare.steamstatic.com/steam/apps/${game.gameId}/header.jpg`)
      .addFields({
        name: 'Get The Game',
        value: `[Steam Store](https://store.steampowered.com/app/${game.gameId})`
      });


    return embed;
  }

  async toJSON(user) {
    const embed = await this.buildEmbed(user);

    if (!embed) {
      throw new Error(`Failed to Embed Game: ${this.gameId}`);
    }
    return embed.toJSON();
  }
}

module.exports = EmbeddedGame;
