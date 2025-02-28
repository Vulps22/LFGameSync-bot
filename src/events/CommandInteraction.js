const BotEvent = require("../interfaces/botEvent.js");
const { Interaction, Events } = require('discord.js');
const Logger = require('../utils/logger.js');
const commandHandler = require('../utils/commandHandler.js');
const Command = require('../interfaces/Command.js');
const { sendTo } = require('../utils/notify.js');
const {User, DiscordServer, DiscordServerUser, GameAccount} = require('../models');


// @ts-check

/**
 * @type {BotEvent}
 */
const interactionEvent = {
	name: Events.InteractionCreate,
	once: false,
	async execute(interaction) {

		await checkServer(interaction);
		await checkUser(interaction);

		if (interaction.isAutocomplete()) {
			const command = getCommand(interaction.commandName);

			if (!command) { commandNotFound(interaction.commandName); return; }
			await command.autoComplete?.(interaction);
		}
		if (!interaction.isCommand()) return;

		const command = getCommand(interaction.commandName);

		if (!command) { commandNotFound(interaction.commandName); return; }

		try {
			await command.execute(interaction);
		} catch (error) {
			console.log(error);
			Logger.log('Interaction', `Failed to execute command ${interaction.commandName}. ${error}`);
			await interaction.reply({ content: `[Interaction] Failed to execute command ${interaction.commandName}.`, ephemeral: true });
		}
	},
};

/**
 * 
 * @param {string} commandName 
 * @returns {Command}
 */
function getCommand(commandName) {
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

/**
 * Check if the server exists in the database and ensure the server is up to date.
 * @param {Interaction} interaction 
 */
async function checkServer(interaction) {
	const guild = interaction.guild;
	const discordId = guild.id;

	// Check if the server exists
	const dbServer = await DiscordServer.findOne({
		where: {
			discordId: discordId,
		},
	});

	if (!dbServer) {
		DiscordServer.create({
			discordId: discordId,
			discordName: guild.name,
		});
	} else {
		// Update the server's name if it has changed
		if (dbServer.discordName !== guild.name) {

			dbServer.discordName = guild.name;
			await dbServer.save();

		}
	}

}

/**
 * Check if the user exists in the database and ensure the user is up to date.
 * @param {Interaction} interaction 
 */
async function checkUser(interaction) {
	const InteractionUser = interaction.user;
	const discordId = InteractionUser.id;

	// Check if the user exists
	const dbUser = await User.findOne({
		where: {
			discordId: discordId,
		},
	});

	if (!dbUser) {
		const user = await User.create({
			discordId: discordId,
			discordName: InteractionUser.username,
		});
		await GameAccount.create({
			userId: user.id,
		})
		await DiscordServerUser.create({
			serverId: interaction.guildId,
			userId: user.id,
		});
	} else {
		// Update the user's name if it has changed
		if (dbUser.discordName !== InteractionUser.username) {
			dbUser.discordName = InteractionUser.username;
			await dbUser.save();
		}
	}

}

module.exports = interactionEvent;