import axios from "axios";
import { Interaction } from "discord.js";
import config from "../config";
import BotEvent from "../interfaces/botEvent";

const BotJoinEvent: BotEvent = {
	name: "guildCreate",
	once: false,
	async execute(guild) {
		console.log("Joined a server!")

		// send server ID, name and image to https://gamesync.ajmcallister.co.uk/api/lfg/register_server
		console.log("Registering Server with data: ");
		const data = {
			server_id: guild?.id,
			server_name: guild?.name,
			server_image: guild?.iconURL()
		};

		console.log(data);
		
		const configuration = {
			url: `${config.baseURL}/api/lfg/register_server`,
			method: 'post',
			data: data,
		};

		await axios.post(config.baseURL + '/api/lfg/register_server', data)
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