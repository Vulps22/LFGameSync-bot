const { EmbedBuilder, Message, Client } = require('discord.js');
const path = require('path');


const pad_size = 40;

// ANSI escape codes for red, blue, and reset:
const RED = "\x1b[31m";
const BLUE = "\x1b[34m";
const RESET = "\x1b[0m";

/**
 * Returns the current time formatted as "D-M-YYYY HH:MM:SS".
 * @returns {string}
 */
function getCurrentTime() {
    let date = new Date();
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

/**
 * Extracts the caller file name from the call stack.
 * @returns {string} The base name of the caller file.
 */
function getCallerFileName() {
    const originalFunc = Error.prepareStackTrace;
    try {
        const err = new Error();
        Error.prepareStackTrace = (_, stack) => stack;
        const stack = err.stack;
        // stack[0] is this function, stack[1] is the logger function, so stack[3] should be the caller
        const callerFile = stack[3] && stack[3].getFileName();
        return callerFile ? path.basename(callerFile) : 'unknown';
    } catch (err) {
        return 'unknown';
    } finally {
        Error.prepareStackTrace = originalFunc;
    }
}

/**
 * Formats and returns just the header (timestamp and caller file) padded to pad_size characters.
 * @returns {string}
 */
function formatHeader() {
    const header = `[${getCurrentTime()}] [${getCallerFileName()}]`;
    return header.length < pad_size ? header.padEnd(pad_size, ' ') + "| " : header + " | ";
}

module.exports = {

    /**
     * Logs a message to the console like a normal console.log.
     * Also sends the message to the logs channel on discord
     * Note that only the first argument is sent to discord
     * @param {...any} message 
     * @returns {Message}
     */
    async log(...message) {
        const header = formatHeader();
        console.log(`${header}`, ...message);

        /** @type {Client} */
        const client = my.client;

        //log the changes to the log channel on discord
        const channel = await client.channels.fetch(my.discordLogChannelId);

        await channel.send(message[0]);
    },

    /**
     * Logs a debug message
     * Debug messages are only shown in the console (not sent to discord)
     * @param {...any} message 
     */
    async debug(...message) {
        const header = formatHeader();
        console.log(`${BLUE}${header}`, ...message, RESET);
    },

    /**
     * Send an error message to the console and the error channel on discord
     * @param  {...any} message 
     */
    async error(...message) {
        const header = formatHeader();
        console.error(`${RED}${header}`, ...message, RESET);

        /** @type {Client} */
        const client = my.client;

        //log the changes to the log channel on discord
        const channel = await client.channels.fetch(my.discordErrorChannelId);

        await channel.send(message[0]);
    },
};
