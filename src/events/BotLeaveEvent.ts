import axios from "axios";
import { Interaction } from "discord.js";
import config from "../config";
import BotEvent from "../interfaces/botEvent";

const BotJoinEvent: BotEvent = {
	name: "guildDelete",
	once: false,
	async execute(interaction: Interaction) {
		console.log("Left a server!")

		// send server ID to https://gamesync.ajmcallister.co.uk/api/lfg/remove_server
		console.log(`${config.baseURL}/api/lfg/remove_server`);
		const data = {
			server_id: interaction.guildId
		};

		await axios.post(config.baseURL + '/api/lfg/register_server', data);
	},
}

module.exports = BotJoinEvent;