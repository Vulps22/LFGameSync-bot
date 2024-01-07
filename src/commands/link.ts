import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Interaction } from "discord.js";
import Command from "src/interfaces/Command";
import config from '../config'
import Caller from "../utils/caller";
import logger from "../utils/logger";

const link: Command = {
	data: new SlashCommandBuilder()
		.setName('link')
		.setDescription('Link your Discord to a Game Library'),
	async execute(interaction: Interaction) {
		let action = interaction as CommandInteraction;

		let token = await Caller.askForToken(action.user.id);

		if(!token.data) {
			logger.log("error", token.data)
			return;
		}

		token = token.data.token;
/**
		let embed = new EmbedBuilder()
		.setTitle('Add a Game Library')
		.setDescription("Link your Discord account with any of these Game Libraries")
		.addFields({name: 'View Linked Accounts', value: `[Link Manager](${config.baseURL}/link?token=${token})`});

		action.reply({
			embeds: [embed],
			ephemeral: true
		});
		**/

		action.reply({content: `Due to a recently discovered technical bug I have disabled the /link command until it can be fixed. You can still link your accounts from the [Dashboard](${config.baseURL}). \n Sorry for the Inconvenience. I am working on it.`})
	}
}

module.exports = link;