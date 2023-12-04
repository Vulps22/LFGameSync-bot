import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { Interaction } from "discord.js";
import Command from "src/interfaces/Command";

const link: Command = {
	data: new SlashCommandBuilder()
	.setName('dashboard')
	.setDescription('A link to the bot\'s dashboard where you can enable sharing with this server'),
	async execute(interaction: Interaction) {
		let action = interaction as CommandInteraction;
		action.reply('[Dashboard](https://gamesync.ajmcallister.co.uk)');
	}
}

module.exports = link;