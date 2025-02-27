const { Client, WebhookClient } = require('discord.js');
const { config } = require('dotenv');

// Load environment variables from .env file (if applicable)
config();

const channels = {
    ERROR: process.env.WEBHOOK_ERROR,
    INFO: process.env.WEBHOOK_LOG,
    // Add more channels as needed
};

const channelIDs = {
    SERVERS: process.env.STAT_SERVERS,
    USERS: process.env.STAT_USERS,
    GAMES: process.env.STAT_GAMES
};
/**
 * @deprecated Will be replaced with discord's Channel.send()
 * @param {*} channelKey 
 * @param {*} message 
 * @returns 
 */
const sendTo = (channelKey, message) => {
    const channelURL = channels[channelKey];

    if (!channelURL) {
        console.error(`Channel with key "${channelKey}" not found.`);
        return;
    }

    const webhookClient = new WebhookClient({ url: channelURL });
    webhookClient.send(`${message}`);
};

const setStat = async (channelId, value, client) => {
    try {
        const channel = await client.channels.fetch(channelId);
        if (!channel || channel.isDMBased()) return;
        await channel.setName(value);
    } catch (error) {
        console.error(`Failed to update channel name: ${error}`);
    }
};

module.exports = { sendTo, setStat, channels, channelIDs };
