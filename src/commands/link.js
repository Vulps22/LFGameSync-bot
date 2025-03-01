const { SlashCommandBuilder } = require('discord.js');
const SteamAuth = require('node-steam-openid');
const { User, LinkToken } = require('../models');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('link')
    .setDescription('Link your Steam account to your Discord account'),

  async execute(interaction) {
    const baseURL = my.linkBaseUrl;
    const discordId = interaction.user.id;
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

    const link = await user.createLinkToken();

    const steam = new SteamAuth({
      realm: `${baseURL}`, // Match this with your previous config
      returnUrl: `${baseURL}/auth/steam/callback?token=${link.token}`,
      apiKey: my.steamApiKey,
  });
    // Generate Steam login URL
    const loginUrl = await steam.getRedirectUrl();

    await interaction.reply({
      content: `Click this link to link your [Steam account](${loginUrl})`,
      ephemeral: true
    });
  },
};
