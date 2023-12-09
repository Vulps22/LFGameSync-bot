import { Client, VoiceChannel, WebhookClient } from "discord.js";
import { env } from "process";

interface Channels {
    [key: string]: string; // Define an object where keys are strings and values are strings
}

const channels: Channels = {
    ERROR: process.env.WEBHOOK_ERROR!,
    INFO: process.env.WEBHOOK_LOG!,
    // Add more channels as needed
};

const channelIDs: Channels = {
    SERVERS: process.env.STAT_SERVERS!,
    USERS: process.env.STAT_USERS!,
    GAMES: process.env.STAT_GAMES!
}

const sendTo = (channelKey: string, message: string) => {
    const channelURL = channels[channelKey];

    if (!channelURL) {
        console.error(`Channel with key "${channelKey}" not found.`);
        return;
    }

    const webhookClient = new WebhookClient({ url: channelURL });
    webhookClient.send(`${message}`);
};

const setStat = (channelId: string, value: string, client: Client) => {
    const statusChannel = client.channels.fetch(channelId).then((channel) => {
        if(!channel) return;
        if(channel.isDMBased()) return;
        channel.setName('boo!');
    })

    if(!statusChannel) return;

    console.log(`Connected Servers: ${client.guilds.cache.size}`);
}


export { sendTo, setStat, channels };
