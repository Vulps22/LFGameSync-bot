// Imports
const BotEvent = require("../interfaces/botEvent.js");
const { Client, Events } = require('discord.js');
const Logger = require('../utils/logger.js');
const DeployCommands = require('../utils/deployCommands.js');


// @ts-check

/**
 * @type {BotEvent}
 */
const readyEvent = {
	name: 'ready',
	once: true,
	async execute(client) {
		// Logging when client is ready.
		if (client.user) Logger.log('Client', `Logged in as ${client.user.tag}!`);
		else Logger.log('Client', 'Not Logged in!');

		// Deploying Commands.
		(async () => {
			try {
				DeployCommands.deployCommands();
				console.warn("Commands not deployed: Deployment Disabled. Please deploy them manually.");
			} catch (error) {
				Logger.error(error);
			}
		})();
	},
};

module.exports = readyEvent;