
import Caller from "../utils/caller";
import BotEvent from "../interfaces/botEvent";


const BotJoinEvent: BotEvent = {
	name: "guildCreate",
	once: false,
	async execute(guild) {
		console.log("Joined a server!")

		// send server ID, name and image to https://gamesync.ajmcallister.co.uk/api/lfg/register_server
		console.log("Registering Server with data: ");
		await Caller.registerServer(guild?.id, guild?.name, guild?.iconURL());
	},
}

module.exports = BotJoinEvent;