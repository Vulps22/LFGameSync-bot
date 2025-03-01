const { SlashCommandBuilder } = require('discord.js');
const { User, GameAccount } = require('../models');



module.exports = {
    data: new SlashCommandBuilder()
        .setName('sync')
        .setDescription('Sync your game library with the bot'),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const discordId = interaction.user.id;
        const user = await User.findOne({
            where: {
                discordId: discordId
            }
        });

        if (!user) {
            interaction.editReply({
                content: 'Something went wrong: We could not find your Discord account in our database. This is likely a bug, please contact the developers.',
                ephemeral: true
            });

            return;
        }

        if(!await user.isLinked()){
            await interaction.editReply({
                content: 'You have not linked your Steam account. Run /link to link your account.',
                ephemeral: true
            });
            return;
        }

        const gameAccount = await user.getGameAccount();
        await gameAccount.sync();

        await interaction.editReply({
            content: 'Syncing complete!',
            ephemeral: true
        });

    }
};
