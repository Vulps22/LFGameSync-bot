require('dotenv').config();

const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');
const CommandHandler = require('./utils/commandHandler.js');
const DeployCommands = require('./utils/deployCommands.js');
const Logger = require('./utils/logger.js');
const EventHandler = require('./utils/eventHandler.js');
const Config = require('./config.js');
const sequelize = require('./utils/sequelize.js');
const express = require('express');



/**
 * https://discord.com/api/oauth2/authorize?client_id=1139301810369204254&permissions=2147601472&scope=bot
 */

//CONFIRM DATABASE CONNECTION
checkDatabase();

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
		allowedMentions: { parse: ['users', 'roles'], repliedUser: true },
	});

	EventHandler.registerEvents(client);
	CommandHandler.registerCommands(client);

	return client;
}

// REST.
const rest = new REST().setToken(Config.clientToken);

//export rest
module.exports = { rest };

global.my = {
	client: createClient(),
}


my.client.login(Config.clientToken);

startServer();

async function checkDatabase() {
	try {
		await sequelize.authenticate();
		Logger.log('Database', 'Connection has been established successfully.');
	} catch (error) {
		console.error('Database', 'Unable to connect to the database Aborting startup:', error);
		process.exit(1);
	}
}

async function startServer() {
	
	const app = express();
	const authRoutes = require('./routes/auth');

	app.use('/auth', authRoutes);

	app.listen(5000, () => {
		console.log('Bot backend running on https://localhost:5000');
	});

}