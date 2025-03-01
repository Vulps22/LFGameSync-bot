const BotEvent = require('../interfaces/botEvent.js');
const DiscordServer = require('../models/discord_server.js');
const { Guild } = require('discord.js');
const Logger = require('../utils/logger.js');
// @ts-check

/**
 * @type {BotEvent}
 */
const BotJoinEvent = {
	name: "guildCreate",
	once: false,
	/**
	 * 
	 * @param {Guild} guild 
	 */
	async execute(guild) {
		Logger.log("Joined a server!")

		Logger.log("Registering Server");
		// Try to find or create the user
			const [server] = await DiscordServer.findOrCreate({
				where: { discordId: guild.id },
				defaults: { name: guild.name }
			});
	},
}

module.exports = BotJoinEvent;