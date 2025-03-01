const Caller = require('../utils/caller.js');
const BotEvent = require('../interfaces/botEvent.js');
const DiscordServer = require('../models/discord_server.js');
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

		console.log("Registering Server");
		// Try to find or create the user
			const [server] = await DiscordServer.findOrCreate({
				where: { discordId: guild.id },
				defaults: { name: guild.name }
			});
	},
}

module.exports = BotJoinEvent;

//invite URL https://discord.com/oauth2/authorize?client_id=1182799024189870151