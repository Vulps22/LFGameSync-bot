const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');
const CommandHandler = require('./utils/commandHandler.js');
const DeployCommands = require('./utils/deployCommands.js');
const Logger = require('./utils/logger.js');
const EventHandler = require('./utils/eventHandler.js');
const Config = require('./config.js');

/**
 * https://discord.com/api/oauth2/authorize?client_id=1139301810369204254&permissions=2147601472&scope=bot
 */

// Logging that the client is starting.
Logger.log('Client', 'Starting...');


// Create a new instance of the Client class and register events and commands.
function createClient() {
	const client = new Client({
		intents: [
			GatewayIntentBits.Guilds,
			GatewayIntentBits.GuildMessages,
			GatewayIntentBits.GuildMessageReactions,
		],
	});

	EventHandler.registerEvents(client);
	CommandHandler.registerCommands(client);

	return client;
}

// REST.
const rest = new REST().setToken(Config.clientToken);

//export rest
module.exports = { rest };

// Create the client and log in.
const client = createClient();
client.login(Config.clientToken);