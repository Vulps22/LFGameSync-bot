const { SlashCommandBuilder } = require('discord.js');
const { User, GameAccount } = require('../models');
const Logger = require('../utils/logger.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('sync')
        .setDescription('Sync your game library with the bot'),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        
        const discordId = interaction.user.id;
        Logger.log("**Command**: Sync | Executing sync command for discord user:", discordId);
        const user = await User.findOne({
            where: {
                discordId: discordId
            }
        });

        if (!user) {
            Logger.log("**Command**: Sync | User not found for Discord ID:", discordId);
            interaction.editReply({
                content: 'Something went wrong: We could not find your Discord account in our database. This is likely a bug, please contact the developers.',
                ephemeral: true
            });

            return;
        }

        if(!await user.isLinked()){
            Logger.log("**Command**: Sync | User not linked for Discord ID:", discordId);
            await interaction.editReply({
                content: 'You have not linked your Steam account. Run /link to link your account.',
                ephemeral: true
            });
            return;
        }

        /** @type {GameAccount} */
        const gameAccount = await user.getGameAccount();
        const changes = await gameAccount.sync();
        Logger.log("**Command**: Sync | Sync Complete for Discord ID:", discordId, "Changes:", changes);
        await interaction.editReply({
            content: 'Syncing complete!',
            ephemeral: true
        });

    }
};
