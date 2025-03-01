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
		Logger.log(`**Server Left** Unregistering Server: ${guild.name} - ${guild.id}`);

		try {
			Logger.log("**Server Left** Deleting Server Users");
			DiscordServerUser.destroy({
				where: { serverId: guild.id }
			});

			Logger.log("**Server Left** Server Users Deleted Successfully");

		} catch (error) {
			Logger.error("**Server Left** Failed To Delete Server Users", error);
		}

		try {
			Logger.log("**Server Left** Deleting Server");

			DiscordServer.destroy({
				where: { discordId: guild.id }
			});
		} catch (error) {
			Logger.error("**Server Left** Failed To Delete Server", error);
		}
	},
}

module.exports = BotJoinEvent;