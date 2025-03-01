const axios = require("axios");
const BotEvent = require("../interfaces/botEvent.js");
const { Interaction } = require("discord.js");
const config = require("../config.js");
const Caller = require("../utils/caller.js");
const DiscordServer = require("../models/discord_server.js");
const DiscordServerUser = require("../models/discord_server_user.js");


// @ts-check

/**
 * @type {BotEvent}
 */
const BotJoinEvent = {
	name: "guildDelete",
	once: false,
	async execute(guild) {
		console.log("Left a server!")

		DiscordServerUser.destroy({
			where: { serverId: guild.id }
		});

		DiscordServer.destroy({
			where: { discordId: guild.id }
		});
	},
}

module.exports = BotJoinEvent;