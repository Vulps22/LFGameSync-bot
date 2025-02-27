const { SlashCommandBuilder } = require("discord.js");

/** 
 * @typedef {Object} Command
 * @property {SlashCommandBuilder} data
 * @property {(interaction: Interaction) => Promise<void>} execute
 * @property {(interaction: Interaction): Promise<void>} [autoComplete]
 */

/** @type {Command} */
const Command = {
    data: new SlashCommandBuilder(),
    execute: async () => {},
    autoComplete: async () => {},
};

module.exports = Command;
