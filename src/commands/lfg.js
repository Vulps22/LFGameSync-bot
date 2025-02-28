const { Interaction, CommandInteraction, CommandInteractionOptionResolver, SlashCommandBuilder, AutocompleteInteraction, ButtonBuilder, ButtonStyle, ButtonInteraction, AnySelectMenuInteraction } = require('discord.js');
const { StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } = require('discord.js');

const Command = require('../interfaces/Command.js');
const config = require('../config.js');
const Caller = require('../utils/caller.js');
const EmbeddedGame = require('../utils/embeddedGame.js');
const { Game, GameUser, DiscordServer, DiscordServerUser, User } = require('../models'); // Adjust the import path if necessary



// @ts-check

/** @type {Command} */
const lfgCommand = {
	data: new SlashCommandBuilder()
		.setName('lfg')
		.setDescription('Find users who own a game')
		.addStringOption(option => option.setName('game')
			.setDescription('The game to search for')
			.setAutocomplete(true)
			.setRequired(true)),

	async autoComplete(interaction) {
		const action = interaction;

		const name = action.options.getFocused();

		const games = await Game.search(name);

		action.respond(games.map((game) => ({ name: game.name, value: String(game.id) })));
	},

	async execute(interaction) {

		let action = interaction;
		const options = action.options
		const gameId = options.getString('game');
		const serverId = interaction.guildId;
		const userId = interaction.user.id;
		if (!gameId) {
			await action.reply('No game provided');
			return;
		}

		try {


			const users = await findPlayers(gameId, serverId, userId);

			if (users.length === 0) {
				await action.reply({ content: 'No users found with that game', ephemeral: true });
				return;
			}
			const selectMenu = new StringSelectMenuBuilder()
				.setCustomId('lfg')
				.setPlaceholder('Select a user to message')
				.setMinValues(1)
				.setMaxValues(users.length);
			console.log("Users", users);
			selectMenu.addOptions(users.map((user) => {
				return new StringSelectMenuOptionBuilder()
					.setLabel(user.discordName)
					.setValue(user.discordId)
					.setDescription(user.discordName);
			}));

			const openRequestButton = new ButtonBuilder()
				.setCustomId('open_request')
				.setLabel('Anyone')
				.setStyle(ButtonStyle.Success);
			const selectRow = new ActionRowBuilder()
				.addComponents(selectMenu).toJSON();

			const buttonRow = new ActionRowBuilder()
				.addComponents(openRequestButton).toJSON();

			if (action.deferred || action.replied) return;

			const response = await action.reply({
				content: 'Who do you want to tag?',
				components: [selectRow, buttonRow], //, buttonRow as any
				ephemeral: true
			});

			const collectorFilter = (interaction) =>
				interaction.user.id === userId;

			const selection = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });
			const game = await Game.findByPk(gameId);

			if (!game) {
				await action.reply({ content: 'Game not found', ephemeral: true });
				return;
			}

			if (selection.isStringSelectMenu()) {
				const selectedValues = selection.values;

				// Build the username string
				const selectedUserNames = users
					.filter((user) => selectedValues.includes(user.discordId))
					.map((user) => user.discordId);

				action.deleteReply();

				const embeddedGame = new EmbeddedGame(String(game.id));
				embeddedGame.addUsers(selectedUserNames);

				const gameEmbed = await embeddedGame.toJSON(interaction.user.id)

				action.channel?.send({ embeds: [gameEmbed] })
			} else if (selection.isButton() && selection.customId === 'open_request') {

				const embeddedGame = new EmbeddedGame(String(game.id));
				const gameEmbed = await embeddedGame.toJSON(interaction.user.id)

				action.channel?.send({ embeds: [gameEmbed] });
			}


		} catch (error) {
			console.error(error);
			await action.reply({ content: 'An error occurred while searching for LFG users', ephemeral: true });
		}
	},
};


/**
 * Finds players who own a specified game and are sharing their library in a specific server.
 * 
 * @param {number} gameId - The ID of the game to search for.
 * @param {string} serverId - The ID of the server to check for sharing.
 * @param {string} userId - The Discord user ID requesting the information.
 * @returns {Promise<User[]>} - A promise that resolves with an array of users.
 */
async function findPlayers(gameId, serverId, userId) {
	try {

		//step 1: find the server and user
		const server = await DiscordServer.findOne({
			where: {
				discordId: serverId,
			},
		});

		if (!server) {
			return "Server not found";
		}

		const user = await User.findOne({
			where: {
				discordId: userId,
			},
		});

		if (!user) {
			return "User not found";
		}

		// Step 2: Find the Game
		const game = await Game.findByPk(gameId);
		if (!game) {
			return "Game not found";
		}

		// Step 3: Find the Server-User Relationship for Sharing Library
		const serverUser = await DiscordServerUser.findOne({
			where: {
				serverId: server.id,
				userId: user.id,
			},
		});

		console.log(serverUser);

		if(!serverUser) {
			throw new Error('Requesting User not found in server');
		}

		if (!serverUser.shareLibrary) {
			return "Not Sharing"; // User is not sharing their library
		}

		// Step 4: Find Users Who Own the Game and Are Sharing in the Server
		const users = await User.findAll({
			include: 
				{
					model: DiscordServerUser,
					as: 'serverUsers',
					where: { serverId: server.id, shareLibrary: true }, // Ensure they are sharing the library
				},
		});

		return users; // List of users who own the game and share their library in the specified server
	} catch (error) {
		console.error("Error finding players:", error);
		throw new Error("Error finding players");
	}
}



module.exports = lfgCommand;