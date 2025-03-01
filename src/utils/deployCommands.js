const { REST, Routes } = require('discord.js');
const Command = require('../interfaces/Command.js');
const commandHandler = require('./commandHandler.js');
const fileSystem = require('fs');
const filePath = require('path');
const config = require('../config.js');

module.exports = {
	/**
	 * Creates a JSON representation of all registered Commands for global deployment.
	 * @returns {[]} The JSON body for the deployment.
	 */
	getDeploymentJson: function () {
		// Creates new collection for commands.
		const commands = [];

		const commandList = commandHandler.getCommands();

		commandList.forEach((command, name) => {


			// Checks if the command has a valid structure.
			if (!command || !command.data || !command.execute) {
				console.log('DeploymentCommands', `${name} does not have a valid command structure.`);
				return;
			}
			// Adds the command to the collection.
			commands.push(command.data.toJSON());
		});

		return commands;
	},

	/**
	 * PUTs the global commands to Discord.
	 * @param rest The REST object to use for deployment.
	 */
	deployCommands: async function () {
		console.log('Started refreshing application (/) commands.');

		const rest = new REST().setToken(my.token);

		const data = await rest.put(
			Routes.applicationCommands(config.clientId),
			{ body: this.getDeploymentJson() },
		).then(() => {
			console.log('Successfully reloaded application (/) commands.');
			// Retrieve the list of global commands.
			const globalCommands = rest.get(
				Routes.applicationCommands(config.clientId),
			).then((commandsList) => {
				// Creates new collection for commands.
				const commands = commandsList;
				console.log(`${commands.length} global commands registered.`);
			});
		});
	},
};