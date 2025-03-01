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
		Logger.log(`**Server Joined** ${guild.name} - ${guild.id}`);

		Logger.log("**Server Joined** Registering Server");
		try {
			// Try to find or create the user
			const [server] = await DiscordServer.findOrCreate({
				where: { discordId: guild.id },
				defaults: { name: guild.name }
			});

			Logger.log(`**Server Joined** Server Registered Successfully: ${server.name} - ${server.discordId} - Internal ID: ${server.id}`);

		} catch (error) {
			Logger.error("**Server Joined** Failed to register server", error);
		}
	},
}

module.exports = BotJoinEvent;