const { CommandInteraction, CommandInteractionOptionResolver, SlashCommandBooleanOption, SlashCommandBuilder, Interaction } = require('discord.js');
const config = require('../config.js');
const Command = require('../interfaces/Command.js');
const axios = require('axios');
const Caller = require('../utils/caller.js');
const { DiscordServerUser, User } = require('../models'); // Adjust the import path if necessary


// @ts-check

/** @type {import('../interfaces/Command').Command} */
const sharing = {
	data: new SlashCommandBuilder()
		.setName('sharing')
		.setDescription('enable/disable sharing')
		.addBooleanOption(option => option.setName('set')
			.setDescription('Do you want to turn sharing On or Off?')
			.setRequired(true)),
	async execute(interaction) {
		let action = interaction;
		const options = action.options;
		let state = options.getBoolean('set');

		const userId = interaction.user.id

		//Enable sharing for the DiscordServerUser belonging to User 
		try {

			const discordServerUser = await DiscordServerUser.findOne({
				include: {
					model: User,
					as: 'user',
					where: { discordId: userId }
				}
			});
			
			if (!discordServerUser) {
				console.error(`DiscordServerUser entry not found for Discord ID ${userId}.`);
			}
			
			discordServerUser.shareLibrary = state;
			await discordServerUser.save();

			const user = await discordServerUser.getUser()			
			const userLinked = await user.isLinked();

			action.reply({
				content: `Game Library Sharing has been ${state === true ? 'enabled' : 'disabled'} on this server ${ userLinked ? '' : 'but you have not linked your Steam Library. Run /link to sync your games with the bot'}`,
				ephemeral: true
			});
		} catch (error) {
			console.error("Error While running /sharing")
			console.error(error);
		}

	}
}

module.exports = sharing;