import { Interaction, Events } from 'discord.js';
import Logger from '../utils/logger';
import commandHandler from '../utils/commandHandler';
import BotEvent from '../interfaces/botEvent'
import Command from '../interfaces/Command';
import { sendTo } from '../utils/notify';

function getCommand(commandName: string): Command | undefined {
	const command: Command | undefined = commandHandler.getCommands().get(commandName);

	if (!command) {
		Logger.log('Interaction', `Command ${commandName} does not exist.`);
		return;
	}

	return command;
}

function commandNotFound(commandName: string) {
 console.error(`Command Not Found: ${commandName}`);
 sendTo("ERROR", `Command Not Found: ${commandName}`);
}

const interactionEvent: BotEvent = {
	name: Events.InteractionCreate,
	once: false,
	async execute(interaction: Interaction) {
		if (interaction.isAutocomplete()) {
			const command = getCommand(interaction.commandName);
			if (!command) { commandNotFound(interaction.commandName); return;}
			await command.autoComplete?.(interaction);
		}
		if (!interaction.isCommand()) return;

		const command = getCommand(interaction.commandName);

		if (!command) { commandNotFound(interaction.commandName); return;}

		try {
			await command.execute(interaction);
		} catch (error) {
			Logger.log('Interaction', `Failed to execute command ${interaction.commandName}. ${error}`);
			await interaction.reply(`[Interaction] Failed to execute command ${interaction.commandName}.`);
		}
	},
};

module.exports = interactionEvent;