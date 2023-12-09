import { CommandInteraction, CommandInteractionOptionResolver, SlashCommandBooleanOption, SlashCommandBuilder } from "discord.js";
import { Interaction } from "discord.js";
import config from '../config'
import Command from "src/interfaces/Command";
import axios from "axios";
import Caller from "../utils/caller";

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
		try {
			const response = await Caller.setSharing(action.guildId!, action.user.id, state!)
			const data = response.data;
			console.log(response.data);

			switch (data.message) {

				case 'Server not found':
					await Caller.registerServer(action.guildId!, action.guild!.name!, action.guild!.iconURL()!);
					this.execute(interaction);
					return;
				case 'User not Found':
					await Caller.registerUser(action.guildId!, action.user.id, action.user.username)
					this.execute(interaction);
					return;
				case 'Sharing Changed':
					break;
			}

			action.reply({
				content: `Game Library Sharing has been ${state === true ? 'enabled' : 'disabled'} on this server ${data.isLinked ? '' : 'but you have not linked your Steam Library. Visit the [Dashboard](' + config.baseURL + ') to sync your games with the bot'}`,
				ephemeral: true
			});
		} catch (error) {
			console.error("Error While running /sharing")
			console.error(error);
		}

	}
}

module.exports = link;