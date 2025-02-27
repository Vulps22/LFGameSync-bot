const { CommandInteraction, SlashCommandBuilder } = require("discord.js");
const { Interaction } = require("discord.js");
const Command = require("../interfaces/Command.js");
const config = require('../config.js');

// @ts-check

/** @type {import('../interfaces/Command').Command} */
const dashboard = {
	data: new SlashCommandBuilder()
		.setName('dashboard')
		.setDescription('A link to the bot\'s dashboard where you can enable sharing with this server'),
	async execute(interaction) {
		let action = interaction;
		action.reply({
			content: `[Dashboard](${config.baseURL})`,
			ephemeral: true
		});
	}
}

module.exports = dashboard;