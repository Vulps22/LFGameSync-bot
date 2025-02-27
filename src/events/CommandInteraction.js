const BotEvent = require("../interfaces/botEvent.js");
const { Interaction, Events } = require('discord.js');
const Logger = require('../utils/logger.js');
const commandHandler = require('../utils/commandHandler.js');
const Command = require('../interfaces/Command.js');
const { sendTo } = require('../utils/notify.js');


// @ts-check

/**
 * @type {BotEvent}
 */
const interactionEvent = {
	name: Events.InteractionCreate,
	once: false,
	async execute(interaction) {
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
			await interaction.reply({content: `[Interaction] Failed to execute command ${interaction.commandName}.`, ephemeral: true});
		}
	},
};

/**
 * 
 * @param {string} commandName 
 * @returns {Command}
 */
function getCommand(commandName){
	const command = commandHandler.getCommands().get(commandName);

	if (!command) {
		Logger.log('Interaction', `Command ${commandName} does not exist.`);
		return;
	}

	return command;
}

function commandNotFound(commandName) {
 console.error(`Command Not Found: ${commandName}`);
 sendTo("ERROR", `Command Not Found: ${commandName}`);
}

module.exports = interactionEvent;