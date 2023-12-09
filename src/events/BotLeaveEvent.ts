import axios from "axios";
import { Interaction } from "discord.js";
import config from "../config";
import BotEvent from "../interfaces/botEvent";
import Caller from "../utils/caller";

const BotJoinEvent: BotEvent = {
	name: "guildDelete",
	once: false,
	async execute(guild) {
		console.log("Left a server!")

		console.log(`${config.baseURL}/api/lfg/remove_server`);
		await Caller.removeServer(guild.id);
	},
}

module.exports = BotJoinEvent;