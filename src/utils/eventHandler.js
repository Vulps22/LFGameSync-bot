const { Client } = require('discord.js');
const path = require('path');
const fs = require('fs');
const BotEvent = require('../interfaces/botEvent.js');

module.exports = {
	/**
	 * Registers all the events in the events folder.
	 * @param client {Client}
	 */
	registerEvents: function (client) {
		console.log("=============================================");
		console.log("              EVENT HANDLER");
		console.log("=============================================");
		console.log("Registering events...");

		// Gets all event files - Filters out non .js files.
		const eventsPath = path.join(__dirname, "..", "events");
		console.log("EventHandler", `Loading events from ${eventsPath}.`);
		const eventFiles = fs.readdirSync(eventsPath).filter((file) => {
				return file.endsWith(".js") || file.endsWith(".ts");
			});
		console.log("Found " + eventFiles.length + " events.")
		// Loads all the events in the events folder.
		for (const file of eventFiles) {
			const eventPath = path.join(eventsPath, file);
			/**
			 * @type {BotEvent}
			 */
			const event = require(eventPath);

			if (event.once) {
				console.log("Registering once event..." + event.name)
				client.once(event.name, (...args) => event.execute(...args, client));
			} else {
				console.log("Registering event..." + event.name)
				client.on(event.name, (...args) => event.execute(...args, client));
			}

			// Logs that the event has been loaded.
			console.log("EventHandler", `Registered ${file}.`);
		}

		console.log("=============================================");

	},
};