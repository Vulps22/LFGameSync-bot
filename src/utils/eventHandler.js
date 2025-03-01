const { Client } = require('discord.js');
const path = require('path');
const fs = require('fs');
const Logger = require('./logger.js');
const BotEvent = require('../interfaces/botEvent.js');

module.exports = {
	/**
	 * Registers all the events in the events folder.
	 * @param client {Client}
	 */
	registerEvents: function (client) {
		Logger.log("=============================================");
		Logger.log("              EVENT HANDLER");
		Logger.log("=============================================");
		Logger.log("Registering events...");

		// Gets all event files - Filters out non .js files.
		const eventsPath = path.join(__dirname, "..", "events");
		Logger.log("EventHandler", `Loading events from ${eventsPath}.`);
		const eventFiles = fs.readdirSync(eventsPath).filter((file) => {
				return file.endsWith(".js") || file.endsWith(".ts");
			});
		Logger.log("Found " + eventFiles.length + " events.")
		// Loads all the events in the events folder.
		for (const file of eventFiles) {
			const eventPath = path.join(eventsPath, file);
			/**
			 * @type {BotEvent}
			 */
			const event = require(eventPath);

			if (event.once) {
				Logger.log("Registering once event..." + event.name)
				client.once(event.name, (...args) => event.execute(...args, client));
			} else {
				Logger.log("Registering event..." + event.name)
				client.on(event.name, (...args) => event.execute(...args, client));
			}

			// Logs that the event has been loaded.
			Logger.log("EventHandler", `Registered ${file}.`);
		}

		Logger.log("=============================================");

	},
};