const { CommandInteraction, CommandInteractionOptionResolver, SlashCommandBooleanOption, SlashCommandBuilder, Interaction } = require('discord.js');
const config = require('../config.js');
const Command = require('../interfaces/Command.js');
const axios = require('axios');
const Caller = require('../utils/caller.js');


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

		// send server ID, user ID and state to https://gamesync.ajmcallister.co.uk/api/server/set_sharing
		try {
			const response = await Caller.setSharing(action.guildId, action.user.id, state)
			const data = response.data;
			console.log(response.data);

			switch (data.message) {

				case 'Server not found':
					await Caller.registerServer(action.guildId, action.guild.name, action.guild.iconURL());
					this.execute(interaction);
					return;
				case 'User not Found':
					await Caller.registerUser(action.guildId, action.user.id, action.user.username)
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

module.exports = sharing;