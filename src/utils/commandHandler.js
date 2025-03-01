const { Client } = require("discord.js");
const Command = require("../interfaces/Command.js");
// Imports
const fileSystem = require("node:fs");
const filePath = require("node:path");



// Define the commands array
const commands = new Map();


module.exports = {

	/**
	 * Gets all the commands in the commands folder.
	 * @param client {Client}
	 */
	registerCommands: function(client) {

		// Gets all command files - Filters out non .js files.
		const commandsPath = filePath.join(__dirname, "..", "commands");
		let commandFiles = fileSystem.readdirSync(commandsPath).filter((file) => {
			return file.endsWith(".js") || file.endsWith(".ts");
		});	

		// Loads all the commands in the command's folder.
		for (const file of commandFiles) {
			const command = require(filePath.join(commandsPath, file));

			// Checks if the command has a valid structure.
			if (command["data"] === undefined && command["execute"] === undefined) {
				console.log('CommandHandler', `${file} does not have a valid command structure.`);
				continue;
			}

			// Logs that the command has been loaded.
			console.log('CommandHandler', `Loaded ${file}.`);

			// Adds the command to the collection.
			commands.set(command.data.name, command);
		}
	},

	/**
	 * @returns {Map<string, Command>} The commands collection.
	 */
	getCommands: function() {
		return commands;
	}
}
