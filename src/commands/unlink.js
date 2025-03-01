const { SlashCommandBuilder } = require('discord.js');
const { User, GameAccount } = require('../models');
const Logger = require('../utils/logger');



module.exports = {
  data: new SlashCommandBuilder()
    .setName('unlink')
    .setDescription('Remove the link between your Discord and game accounts'),

  async execute(interaction) {
    const discordId = interaction.user.id;

    Logger.log("**Command**: Unlink | Executing unlink command for Discord user:", discordId);

    //This is a sequelize model
    const user = await User.findOne({
      where: {
        discordId: discordId
      }
    });

    if (!user) {
      interaction.reply({
        content: 'Something went wrong: We could not find your Discord account in our database. This is likely a bug, please contact the developers.',
        ephemeral: true
      });

      return;
    }

    /** @type {GameAccount} */
    const gameAccount = await user.getGameAccount();

    gameAccount.steamId = null;
    await gameAccount.save();
    Logger.log("**Command**: Unlink | Removed link between Discord and game accounts for Discord ID:", discordId);
    await interaction.reply({
      content: `The link between your Discord and game accounts has been removed.`,
      ephemeral: true
    });
  },
};
