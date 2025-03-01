const { 
	Interaction, 
	CommandInteraction, 
	CommandInteractionOptionResolver, 
	SlashCommandBuilder, 
	AutocompleteInteraction, 
	ButtonBuilder, 
	ButtonStyle, 
	ButtonInteraction, 
	AnySelectMenuInteraction 
} = require('discord.js');

const { 
	StringSelectMenuBuilder, 
	StringSelectMenuOptionBuilder, 
	ActionRowBuilder 
} = require('discord.js');

const Command = require('../interfaces/Command.js');
const config = require('../config.js');
const EmbeddedGame = require('../utils/embeddedGame.js');
const { Game, GameUser, DiscordServer, DiscordServerUser, User } = require('../models'); // Ensure correct import path
const Logger = require('../utils/logger.js');

// @ts-check

/** @type {Command} */
const lfgCommand = {
	data: new SlashCommandBuilder()
		.setName('lfg')
		.setDescription('Find users who own a game')
		.addStringOption(option => 
			option.setName('game')
				.setDescription('The game to search for')
				.setAutocomplete(true)
				.setRequired(true)
		),

	/**
	 * Handles autocomplete for game search.
	 * Fetches games from the database based on user input.
	 * @param {AutocompleteInteraction} interaction 
	 */
	async autoComplete(interaction) {
		const name = interaction.options.getFocused();
		const games = await Game.search(name);

		interaction.respond(games.map(game => ({ name: game.name, value: String(game.id) })));
	},

	/**
	 * Executes the LFG command.
	 * @param {CommandInteraction} interaction 
	 */
	async execute(interaction) {
		const options = interaction.options;
		const gameId = options.getString('game');
		const serverId = interaction.guildId;
		const userId = interaction.user.id;

		// Validate input
		if (!gameId) {
			await interaction.reply('No game provided');
			return;
		}

		try {
			// Find users who own the game and are sharing
			const users = await findPlayers(gameId, serverId, userId);

			// If no users found, notify the requester
			if (users.length === 0) {
				await interaction.reply({ content: 'No users found with that game', ephemeral: true });
				return;
			}

			// Create a select menu for choosing users
			const selectMenu = new StringSelectMenuBuilder()
				.setCustomId('lfg')
				.setPlaceholder('Select a user to message')
				.setMinValues(1)
				.setMaxValues(users.length)
				.addOptions(
					users.map(user => 
						new StringSelectMenuOptionBuilder()
							.setLabel(user.discordName)
							.setValue(user.discordId)
							.setDescription(user.discordName)
					)
				);

			// "Anyone" button to post without specifying users
			const openRequestButton = new ButtonBuilder()
				.setCustomId('open_request')
				.setLabel('Anyone')
				.setStyle(ButtonStyle.Success);

			// Create action rows for the components
			const selectRow = new ActionRowBuilder().addComponents(selectMenu).toJSON();
			const buttonRow = new ActionRowBuilder().addComponents(openRequestButton).toJSON();

			// Ensure interaction hasn't already been replied to or deferred
			if (interaction.deferred || interaction.replied) return;

			// Send the selection prompt
			const response = await interaction.reply({
				content: 'Who do you want to tag?',
				components: [selectRow, buttonRow],
				ephemeral: true
			});

			// Filter to ensure only the command initiator can interact
			const collectorFilter = i => i.user.id === userId;

			try {
				// Wait for user to make a selection
				const selection = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });

				// Find the selected game in the database
				const game = await Game.findByPk(gameId);
				if (!game) {
					await interaction.reply({ content: 'Game not found', ephemeral: true });
					return;
				}

				// Handle the selection menu response
				if (selection.isStringSelectMenu()) {
					const selectedValues = selection.values;

					// Get the selected user IDs
					const selectedUserNames = users
						.filter(user => selectedValues.includes(user.discordId))
						.map(user => user.discordId);

					// Remove the selection message
					interaction.deleteReply();

					// Create and send an embed with selected users
					const embeddedGame = new EmbeddedGame(String(game.id));
					const gameEmbed = await embeddedGame.toJSON(interaction.user.id);

					const taggables = selectedUserNames.map(userId => `<@${userId}>`).join(' ');

					await interaction.channel?.send({ content: taggables, embeds: [gameEmbed] });

				// Handle the "Anyone" button response
				} else if (selection.isButton() && selection.customId === 'open_request') {
					const embeddedGame = new EmbeddedGame(String(game.id));
					const gameEmbed = await embeddedGame.toJSON(interaction.user.id);
					interaction.channel?.send({ embeds: [gameEmbed] });
				}

			} catch (error) {
				// Dropdown timed out; no action needed
				Logger.error(error);
				return;
			}

		} catch (error) {
			Logger.error(error);
			await interaction.reply({ content: 'An error occurred while searching for LFG users', ephemeral: true });
		}
	},
};

/**
 * Finds players who own a specified game and are sharing their library in a specific server.
 * @param {number} gameId - The ID of the game to search for.
 * @param {string} serverId - The ID of the server to check for sharing.
 * @param {string} userId - The Discord user ID requesting the information.
 * @returns {Promise<User[]>} - A promise that resolves with an array of users.
 */
async function findPlayers(gameId, serverId, userId) {
	try {
		// Step 1: Ensure the server exists in the database
		const server = await DiscordServer.findOne({ where: { discordId: serverId } });
		if (!server) return [];

		// Step 2: Ensure the requesting user exists in the database
		const user = await User.findOne({ where: { discordId: userId } });
		if (!user) return [];

		// Step 3: Ensure the game exists in the database
		const game = await Game.findByPk(gameId);
		if (!game) return [];

		// Step 4: Ensure the requesting user is part of the server
		const serverUser = await DiscordServerUser.findOne({ 
			where: { serverId: server.id, userId: user.id } 
		});
		if (!serverUser || !serverUser.shareLibrary) return [];

		// Step 5: Find users in the server who own the game and are sharing their library
		const users = await User.findAll({
			include: {
				model: DiscordServerUser,
				as: 'serverUsers',
				where: { serverId: server.id, shareLibrary: true },
			},
		});

		return users;

	} catch (error) {
		Logger.error("Error finding players:", error);
		throw new Error("Error finding players");
	}
}

module.exports = lfgCommand;
