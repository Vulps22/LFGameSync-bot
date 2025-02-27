const axios = require("axios");
const BotEvent = require("../interfaces/botEvent.js");
const { Interaction } = require("discord.js");
const config = require("../config.js");
const Caller = require("../utils/caller.js");


// @ts-check

/**
 * @type {BotEvent}
 */
const BotJoinEvent = {
	name: "guildDelete",
	once: false,
	async execute(guild) {
		console.log("Left a server!")

		console.log(`${config.baseURL}/api/lfg/remove_server`);
		await Caller.removeServer(guild.id);
	},
}

module.exports = BotJoinEvent;