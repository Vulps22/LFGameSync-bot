/*
    help command should list and explain the commands, and offer a short "setup and how to" guide at the top
 */
// Imports.
const { CommandInteraction, EmbedBuilder, Interaction, SlashCommandBuilder } = require('discord.js');
const Command = require('../interfaces/Command.js');
const config = require('../config.js');
const { Logger } = require('sequelize/lib/utils/logger');


// @ts-check

/** @type {import('../interfaces/Command').Command} */
module.export = pingCommand = {
    data: new SlashCommandBuilder().setName('help').setDescription('commands and instructions!'),
    async execute(interaction) {
        let action = interaction;

        let embed = new EmbedBuilder()
            .setTitle("LFGameSync Help")
            .setDescription("LFGameSync facilitates connections with like-minded gamers by linking your game libraries. Easily discover community members who share your gaming interests—simply link your libraries and explore a list of fellow gamers for any game you own.")
            //how to steps
            .addFields([
                {name: ' ', value: ' '},
                { name: 'Connect your Steam Library', value: '> 1. Connect your Game Library with `/link`' },
                { name: 'Turn on Sharing', value: '> 2. use `/sharing` in any server where you want to share your steam library' },
                { name: 'Find Gamers!', value: '> 3. use `/lfg` to find out who else plays the games you want to play!' },
                {name: ' ', value: ' '},
            ])
            //command descriptions
            .addFields([
                { name: '**/help**', value: '> Show this help message' },
                { name: '**/lfg**', value: '> Find a list of all the server members who own the specified game. The Auto Complete will only show games LFGameSync users currently own' },
                { name: '**/link**', value: '> Get a Steam login to pair our game library with your Discord account' },
                { name: '**/sharing**', value: '> Enable or disable sharing on this specific server. Sharing is required to use the `/lfg` command. When disabled, you will not appear in any `/lfg` searches on this server' },
                {name: ' ', value: ' '},
            ])
            .addFields([
                {name: 'For news, updates and help', value: '[Join Our Support Server](https://discord.gg/ZhC4JVFFUV)', inline: true},
                {name: 'Got your own community?', value: `[Add The Bot](${config.baseURL})`, inline: true},
                {name: ' ', value: ' '},
            ])

            

        await action.reply({embeds: [embed]});
        
        Logger.log('Interaction', `Help embed sent`);
    },
};

module.exports = pingCommand;