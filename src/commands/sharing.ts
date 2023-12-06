import { CommandInteraction, CommandInteractionOptionResolver, SlashCommandBooleanOption, SlashCommandBuilder } from "discord.js";
import { Interaction } from "discord.js";
import config from '../config'
import Command from "src/interfaces/Command";
import axios from "axios";

const link: Command = {
	data: new SlashCommandBuilder()
		.setName('sharing')
		.setDescription('enable/disable sharing')
		.addBooleanOption(option => option.setName('set')
			.setDescription('Do you want to turn sharing On or Off?')
			.setRequired(true)) as SlashCommandBuilder,
	async execute(interaction: Interaction) {
		let action = interaction as CommandInteraction;
		const options = action.options as CommandInteractionOptionResolver;
		let state = options.getBoolean('set');

		const userId = interaction.user.id

		// send server ID, user ID and state to https://gamesync.ajmcallister.co.uk/api/server/set_sharing
		console.log(`${config.baseURL}/api/server/set_sharing`);
		const data = {
			server_id: action.guildId,
			user_id: userId,
			state: state
		};

		console.log(data)

		await axios.post(config.baseURL + '/api/server/set_sharing', data)
			.then(response => {
				// response.data holds the parsed response data 
				const data = response.data;
				console.log(response.data);
				if(data.message !== "Sharing Changed") throw new Error(data.message);

				action.reply({
					content:`Game Library Sharing has been ${state === true ? 'enabled' : 'disabled'} on this server ${data.isLinked ? '' : 'but you have not linked your Steam Library. Visit the [Dashboard](' + config.baseURL + ') to sync your games with the bot'}`,
					ephemeral: true
				});
			})
			.catch(error => {
				console.log(error);
				action.reply({
					content:`An error has occured. The Developers have been notified.`,
					ephemeral: true
				});
			});



	}
}

module.exports = link;