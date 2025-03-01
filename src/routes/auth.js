const express = require('express');
const router = express.Router();
const SteamAuth = require('node-steam-openid');
const { User, LinkToken } = require('../models');
const { Client, GatewayIntentBits } = require('discord.js');

router.get('/steam/callback', async (req, res) => {

    baseURL = process.env.BASE_URL;

    try {


        // Find the token from the database
        const tokenRecord = await LinkToken.findOne({ where: { token: req.query.token } });

        if (!tokenRecord) {
            return res.status(400).send('Invalid or expired link token.');
        }

        const steam = new SteamAuth({
            realm: `${baseURL}:5001`, // Match this with your previous config
            returnUrl: `${baseURL}:5001/auth/steam/callback?token=${req.query.token}`,
            apiKey: process.env.STEAM_API_KEY,
        });

        const steamUser = await steam.authenticate(req);
        const steamId = steamUser.steamid;

        // Find the user based on the Discord ID stored with the token
        const discordUser = await User.findByPk(tokenRecord.userId);

        if (!discordUser) {
            return res.status(400).send('User not found.');
        }

        const gameAccount = await discordUser.getGameAccount();

        // Link Steam ID to the Discord user
        gameAccount.steamId = steamId;
        await gameAccount.save();

        // Delete the token after successful linking
        await tokenRecord.destroy({ where: { token: req.query.token } });

        // Send DM confirmation to the user
        const discordMember = await my.client.users.fetch(discordUser.discordId);
        if (discordMember) {
            discordMember.send(`✅ Your Steam account (${steamId}) has been successfully linked to your Discord!`);
        }

        res.send('✅ Steam account linked! You can close this page.');
    } catch (error) {
        console.error('Error in Steam callback:', error);
        res.status(500).send('Authentication failed.');
    }
});

module.exports = router;
