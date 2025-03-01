const { EmbedBuilder, Message } = require('discord.js');
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
     * @param {...any} message 
     * @returns {Message}
     */
    async log(...message) {
        const header = formatHeader();
        console.log(`${header}`, ...message);
        // Optionally, send the log message to a channel if needed.
    },

    /**
     * Logs a debug message in blue text.
     * @param {...any} message 
     */
    async debug(...message) {
        const header = formatHeader();
        console.log(`${BLUE}${header}`, ...message, RESET);
    },

    async editLog(messageId, newString) {
        try {
            const channelId = my.logs;
            const newContent = { content: newString };

            const success = await this.editMessageInChannel(channelId, messageId, newContent);

            if (success) {
                this.debug(`Log message updated: ${newString}`);
            } else {
                this.error(`Failed to update log message with ID: ${messageId}`);
            }
        } catch (error) {
            this.error(`Error editing log message with ID ${messageId}:`, error);
        }
    },

    async error(...message) {
        const header = formatHeader();
        console.error(`${RED}${header}`, ...message, RESET);
        // Optionally, log the error to a channel as well.
    },

    /**
     * @param {Server} server
     */
    async newServer(server) {
        console.log("New Server");
        const channelId = my.servers_log;
        const embed = this.serverEmbed(server);
        const actionRow = this.createActionRow("server");

        try {
            const messageId = await this.sendTo({ embeds: [embed], components: [actionRow], fetchReply: true }, channelId);

            if (messageId) {
                this.debug("Server message logged with ID:", messageId);
                server.message_id = messageId;
                await server.save();
            } else {
                this.error("Failed to log the server message.");
            }
        } catch (error) {
            this.error("Error logging new server:", error);
        }
    },

    /**
     * Sends a message to a specific channel.
     * @param {Object} messageOptions - The message options (content, embeds, etc.) to be sent.
     * @param {string} channelId - The ID of the channel to send the message to.
     * @returns {Promise<string|null>} - Resolves with the message ID if sent successfully, or null if unsuccessful.
     */
    async sendTo(messageOptions, channelId) {
        try {
            const channel = global.client.channels.cache.get(channelId);
            if (channel) {
                messageOptions.fetchReply = true;
                const message = await channel.send(messageOptions);
                return message.id;
            }
            return null;
        } catch (error) {
            this.error(`Failed to send message to channel ${channelId}:`, error);
            return null;
        }
    },

    /**
     * Edits a message in a specific channel.
     * @param {string} channelId - The ID of the channel containing the message.
     * @param {string} messageId - The ID of the message to edit.
     * @param {Object} newContent - The new content for the message.
     * @returns {Promise<boolean>} - Resolves with `true` if edited successfully.
     */
    async editMessageInChannel(channelId, messageId, newContent) {
        try {
            const channel = global.client.channels.cache.get(channelId);
            if (channel) {
                const message = await channel.messages.fetch(messageId);
                if (message) {
                    await message.edit(newContent);
                    return true;
                }
            }
            return false;
        } catch (error) {
            this.error(`Failed to edit message in channel ${channelId}:`, error);
            return false;
        }
    },
};
