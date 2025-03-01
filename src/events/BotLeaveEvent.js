const axios = require("axios");
const BotEvent = require("../interfaces/botEvent.js");
const DiscordServer = require("../models/discord_server.js");
const DiscordServerUser = require("../models/discord_server_user.js");
const Logger = require("../utils/logger.js");

// @ts-check

/**
 * @type {BotEvent}
 */
const BotJoinEvent = {
	name: "guildDelete",
	once: false,
	async execute(guild) {
		Logger.log("Left a server!")

		DiscordServerUser.destroy({
			where: { serverId: guild.id }
		});

		DiscordServer.destroy({
			where: { discordId: guild.id }
		});
	},
}

module.exports = BotJoinEvent;