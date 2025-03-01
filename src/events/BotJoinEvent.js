const Caller = require('../utils/caller.js');
const BotEvent = require('../interfaces/botEvent.js');
const DiscordServer = require('../models/discordServer.js');
const { Guild } = require('discord.js');

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
		console.log("Joined a server!")

		console.log("Registering Server with data: ");
		// Try to find or create the user
			const [server] = await DiscordServer.findOrCreate({
				where: { discordId: discordId },
				defaults: { name: guild.name }
			});
	},
}

module.exports = BotJoinEvent;