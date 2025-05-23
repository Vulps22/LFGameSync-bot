require('dotenv').config();

const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');
const CommandHandler = require('./utils/commandHandler.js');
const DeployCommands = require('./utils/deployCommands.js');
const EventHandler = require('./utils/eventHandler.js');
const sequelize = require('./utils/sequelize.js');
const { Config } = require('./models/');
const express = require('express');

(async function main() {
  // Confirm database connection.
  await checkDatabase();
  await initConfig();

  // Logging that the client is starting.
  console.debug('Client Starting with Config:', my);

  my.client.login(my.token);
  startServer();
  uptimeKuma();
})();

async function checkDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Database', 'Connection has been established successfully.');
  } catch (error) {
    console.error('Database', 'Unable to connect to the database. Aborting startup:', error);
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

async function uptimeKuma() {
  //Uptime-kuma ping
      const axios = require('axios');
      const retry = require('async-retry'); // You might need to install async-retry via npm
  
      setInterval(async () => {
          try {
              await retry(async () => {
                  const response = await axios.get('https://uptime.vulps.co.uk/api/push/O5Y6eI8apw?status=up&msg=OK&ping=');
              }, {
                  retries: 3, // Retry up to 3 times
                  minTimeout: 1000, // Wait 1 second between retries
              });
              console.log('Ping succeeded');
          } catch (error) {
              console.error('Ping failed after retries:', error.message);
          }
      }, 60000); // Ping every 60 seconds
}
