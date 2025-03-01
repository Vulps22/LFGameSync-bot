const { SlashCommandBuilder } = require('discord.js');
const SteamAuth = require('node-steam-openid');
const { User, LinkToken } = require('../models');
const Logger = require('../utils/logger.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('link')
    .setDescription('Link your Steam account to your Discord account'),

  async execute(interaction) {
    const baseURL = my.linkBaseUrl;
    const discordId = interaction.user.id;

    Logger.log("**Command**: Link | Executing link command for Discord user:", discordId);

    // This is a sequelize model lookup.
    const user = await User.findOne({
      where: { discordId: discordId }
    });

    if (!user) {
      Logger.log("**Command**: Link | User not found for Discord ID:", discordId);
      await interaction.reply({
        content: 'Something went wrong: We could not find your Discord account in our database. This is likely a bug, please contact the developers.',
        ephemeral: true
      });
      return;
    }

    // Create a new link token for the user.
    const link = await user.createLinkToken();
    Logger.log("**Command**: Link | Created link token:");

    // Initialize SteamAuth with your configuration.
    const steam = new SteamAuth({
      realm: `${baseURL}`, // This should match your previous configuration.
      returnUrl: `${baseURL}/auth/steam/callback?token=${link.token}`,
      apiKey: my.steamApiKey,
    });

    // Generate the Steam login URL.
    const loginUrl = await steam.getRedirectUrl();

    // Reply to the interaction with the Steam login link.
    await interaction.reply({
      content: `Click this link to link your [Steam account](${loginUrl})`,
      ephemeral: true
    });
    Logger.log("**Command**: Link | Sent reply with Steam login link.");
  },
};
