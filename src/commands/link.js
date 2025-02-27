const { CommandInteraction, EmbedBuilder, SlashCommandBuilder, Interaction } = require('discord.js');
const Command = require('../interfaces/Command.js');
const config = require('../config.js');
const Caller = require('../utils/caller.js');
const logger = require('../utils/logger.js');


// @ts-check

/** @type {import('../interfaces/Command').Command} */
const link = {
	data: new SlashCommandBuilder()
		.setName('link')
		.setDescription('Link your Discord to a Game Library'),
	async execute(interaction) {
		let action = interaction;

		let token = await Caller.askForToken(action.user.id);

		if(!token.data) {
			logger.log("error", token.data)
			return;
		}

		token = token.data.token;

		let embed = new EmbedBuilder()
		.setTitle('Add a Game Library')
		.setDescription("Link your Discord account with any of these Game Libraries")
		.addFields({name: 'View Linked Accounts', value: `[Link Manager](${config.baseURL}/link?token=${token})`});

		action.reply({
			embeds: [embed],
			ephemeral: true
		});
		
	}
}

module.exports = link;