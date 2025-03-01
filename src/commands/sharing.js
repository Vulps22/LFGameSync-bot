const { SlashCommandBuilder } = require('discord.js');
const config = require('../config.js');
const Command = require('../interfaces/Command.js');
const axios = require('axios');
const { DiscordServerUser, User } = require('../models'); // Adjust the import path if necessary
const Logger = require('../utils/logger.js');

// @ts-check

/** @type {import('../interfaces/Command').Command} */
const sharing = {
	data: new SlashCommandBuilder()
		.setName('sharing')
		.setDescription('enable/disable sharing')
		.addBooleanOption(option =>
			option.setName('set')
				.setDescription('Do you want to turn sharing On or Off?')
				.setRequired(true)
		),
	async execute(interaction) {
		const action = interaction;
		const options = action.options;
		const state = options.getBoolean('set');
		const userId = interaction.user.id;

		// Log receipt of the command.
		Logger.log("**Command**: Sharing | Received sharing state:", state, "for Discord user:", userId);

		// Enable sharing for the DiscordServerUser belonging to the User.
		try {
			Logger.log("**Command**: Sharing | Looking up DiscordServerUser for Discord ID:", userId);
			const discordServerUser = await DiscordServerUser.findOne({
				include: {
					model: User,
					as: 'user',
					where: { discordId: userId }
				}
			});

			if (!discordServerUser) {
				Logger.error("**Command**: Sharing | DiscordServerUser entry not found for Discord ID:", userId);
				await interaction.reply({
					content: 'Your account could not be found in the server. Please contact support.',
					ephemeral: true
				});
				return;
			}
			Logger.log("**Command**: Sharing | Found DiscordServerUser. Updating shareLibrary to:", state);
			discordServerUser.shareLibrary = state;
			await discordServerUser.save();
			Logger.log("**Command**: Sharing | Updated shareLibrary state to:", state);

			const user = await discordServerUser.getUser();
			Logger.log("**Command**: Sharing | Retrieved associated User record for Discord ID:", userId);

			const userLinked = await user.isLinked();
			if (userLinked) {
				Logger.log("**Command**: Sharing | User is linked.");
			} else {
				Logger.log("**Command**: Sharing | User is not linked.");
			}

			if (userLinked && state === true) {
				Logger.log("**Command**: Sharing | Initiating game account sync for user:", userId);
				const gameAccount = await user.getGameAccount();
				gameAccount.sync();
			}

			Logger.log("**Command**: Sharing | Sending reply to interaction.");
			await action.reply({
				content: `Game Library Sharing has been ${state === true ? 'enabled' : 'disabled'} on this server ${userLinked ? '' : 'but you have not linked your Steam Library. Run /link to sync your games with the bot'}`,
				ephemeral: true
			});
			Logger.log("**Command**: Sharing | Reply sent successfully.");
		} catch (error) {
			Logger.error("**Command**: Sharing | Error while processing /sharing command:");
			Logger.error(error);
		}
	}
};

module.exports = sharing;
