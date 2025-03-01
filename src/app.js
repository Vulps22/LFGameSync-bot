require('dotenv').config();

const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');
const CommandHandler = require('./utils/commandHandler.js');
const DeployCommands = require('./utils/deployCommands.js');
const Logger = require('./utils/logger.js');
const EventHandler = require('./utils/eventHandler.js');
const sequelize = require('./utils/sequelize.js');
const { Config } = require('./models/');
const express = require('express');

(async function main() {
  // Confirm database connection.
  await checkDatabase();
  await initConfig();

  // Logging that the client is starting.
  Logger.debug('Client Starting with Config:', my);

  my.client.login(my.token);
  startServer();
})();

async function checkDatabase() {
  try {
    await sequelize.authenticate();
    Logger.log('Database', 'Connection has been established successfully.');
  } catch (error) {
    Logger.error('Database', 'Unable to connect to the database. Aborting startup:', error);
    process.exit(1);
  }
}

async function startServer() {
  const app = express();
  const authRoutes = require('./routes/auth');
  app.use('/auth', authRoutes);
  app.listen(5000, () => {
    Logger.log('Bot backend running on https://localhost:5000');
  });
}

async function initConfig() {
  const config = await Config.getConfig();
  const jsonConfig = config.toJSON();
  jsonConfig.client = createClient();
  global.my = jsonConfig;
}

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
