import axios from "axios";
import { Interaction } from "discord.js";
import config from "../config";
import BotEvent from "../interfaces/botEvent";

const BotJoinEvent: BotEvent = {
	name: "guildDelete",
	once: false,
	async execute(guild) {
		console.log("Left a server!")

		// send server ID to https://gamesync.ajmcallister.co.uk/api/lfg/remove_server
		console.log(`${config.baseURL}/api/lfg/remove_server`);
		const data = {
			server_id: guild.id
		};

		console.log(data)

		await axios.post(config.baseURL + '/api/lfg/remove_server', data)
			.then(response => {
				// response.data holds the parsed response data 
				console.log(response.data);
			})
			.catch(error => {
				console.log(error);
			});
	},
}

module.exports = BotJoinEvent;