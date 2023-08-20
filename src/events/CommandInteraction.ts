import { Interaction, Events } from 'discord.js';
import Logger from '../utils/logger';
import commandHandler from '../utils/commandHandler';
import BotEvent from '../interfaces/botEvent'
import Command from '../interfaces/Command';

const interactionEvent: BotEvent = {
	name: Events.InteractionCreate,
	once: false,
	async execute(interaction: Interaction) {
		if (!interaction.isCommand()) return;
		const command: Command | undefined = commandHandler.getCommands().get(interaction.commandName);

		if (!command) {
			Logger.log('Interaction', `Command ${interaction.commandName} does not exist.`);
			return;
		}

		try {
			await command.execute(interaction);
		} catch (error) {
			Logger.log('Interaction', `Failed to execute command ${interaction.commandName}. ${error}`);
			await interaction.reply(`[Interaction] Failed to execute command ${interaction.commandName}.`);
		}
	},
};

module.exports = interactionEvent;