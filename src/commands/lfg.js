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
	 * Executes the LFG Command.
	 * @param {CommandInteraction} interaction 
	 */
	async execute(interaction) {
		const options = interaction.options;
		const gameId = options.getString('game');
		const serverId = interaction.guildId;
		const userId = interaction.user.id;

		Logger.log("**Command**: LFG | Execute triggered with gameId:", gameId, "serverId:", serverId, "userId:", userId);

		// Validate input
		if (!gameId) {
			Logger.log("**Command**: LFG | No game provided by user:", userId);
			await interaction.reply('No game provided');
			return;
		}

		try {
			Logger.log("**Command**: LFG | Searching for players with gameId:", gameId);
			// Find users who own the game and are sharing
			const users = await findPlayers(gameId, serverId, userId);
			Logger.log("**Command**: LFG | Found", users.length, "players");

			// If no users found, notify the requester
			if (users.length === 0) {
				Logger.log("**Command**: LFG | No players found for gameId:", gameId);
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
			Logger.log("**Command**: LFG | Created select menu with options:", users.map(user => user.discordName).join(", "));

			// "Anyone" button to post without specifying users
			const openRequestButton = new ButtonBuilder()
				.setCustomId('open_request')
				.setLabel('Anyone')
				.setStyle(ButtonStyle.Success);
			Logger.log("**Command**: LFG | Created 'Anyone' button");

			// Create action rows for the components
			const selectRow = new ActionRowBuilder().addComponents(selectMenu).toJSON();
			const buttonRow = new ActionRowBuilder().addComponents(openRequestButton).toJSON();
			Logger.log("**Command**: LFG | Created action rows for select menu and button");

			// Ensure interaction hasn't already been replied to or deferred
			if (interaction.deferred || interaction.replied) {
				Logger.log("**Command**: LFG | Interaction already deferred or replied; aborting further processing");
				return;
			}

			// Send the selection prompt
			Logger.log("**Command**: LFG | Sending selection prompt");
			const response = await interaction.reply({
				content: 'Who do you want to tag?',
				components: [selectRow, buttonRow],
				ephemeral: true
			});
			Logger.log("**Command**: LFG | Selection prompt sent");

			// Filter to ensure only the **Command** initiator can interact
			const collectorFilter = i => i.user.id === userId;

			try {
				// Wait for user to make a selection
				Logger.log("**Command**: LFG | Awaiting user selection...");
				const selection = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });
				Logger.log("**Command**: LFG | Received user selection:", selection.customId);

				// Find the selected game in the database
				const game = await Game.findByPk(gameId);
				if (!game) {
					Logger.log("**Command**: LFG | Game not found for gameId:", gameId);
					await interaction.reply({ content: 'Game not found', ephemeral: true });
					return;
				}
				Logger.log("**Command**: LFG | Game found:", game.name);

				// Handle the selection menu response
				if (selection.isStringSelectMenu()) {
					const selectedValues = selection.values;
					Logger.log("**Command**: LFG | User selected values:", selectedValues);

					// Get the selected user IDs
					const selectedUserNames = users
						.filter(user => selectedValues.includes(user.discordId))
						.map(user => user.discordId);
					Logger.log("**Command**: LFG | Resolved selected user IDs:", selectedUserNames);

					// Remove the selection message
					Logger.log("**Command**: LFG | Deleting selection reply");
					interaction.deleteReply();

					// Create and send an embed with selected users
					const embeddedGame = new EmbeddedGame(String(game.id));
					Logger.log("**Command**: LFG | Creating embed for game:", game.name);
					const gameEmbed = await embeddedGame.toJSON(interaction.user.id);
					const taggables = selectedUserNames.map(userId => `<@${userId}>`).join(' ');
					Logger.log("**Command**: LFG | Sending message with tags:", taggables);
					await interaction.channel?.send({ content: taggables, embeds: [gameEmbed] });

				// Handle the "Anyone" button response
				} else if (selection.isButton() && selection.customId === 'open_request') {
					Logger.log("**Command**: LFG | 'Anyone' button pressed");
					const embeddedGame = new EmbeddedGame(String(game.id));
					Logger.log("**Command**: LFG | Creating embed for game:", game.name);
					const gameEmbed = await embeddedGame.toJSON(interaction.user.id);
					await interaction.channel?.send({ embeds: [gameEmbed] });
				}

			} catch (error) {
				// Dropdown timed out; log the error
				Logger.error("**Command**: LFG | Error awaiting selection:", error);
				return;
			}

		} catch (error) {
			Logger.error("**Command**: LFG | Error during **Command** execution:", error);
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
		Logger.log("**Command**: LFG | Finding players for gameId:", gameId, "in serverId:", serverId);
		// Step 1: Ensure the server exists in the database
		const server = await DiscordServer.findOne({ where: { discordId: serverId } });
		if (!server) {
			Logger.log("**Command**: LFG | No server found with discordId:", serverId);
			return [];
		}

		// Step 2: Ensure the requesting user exists in the database
		const user = await User.findOne({ where: { discordId: userId } });
		if (!user) {
			Logger.log("**Command**: LFG | Requesting user not found with discordId:", userId);
			return [];
		}

		// Step 3: Ensure the game exists in the database
		const game = await Game.findByPk(gameId);
		if (!game) {
			Logger.log("**Command**: LFG | No game found with id:", gameId);
			return [];
		}

		// Step 4: Ensure the requesting user is part of the server
		const serverUser = await DiscordServerUser.findOne({ 
			where: { serverId: server.id, userId: user.id } 
		});
		if (!serverUser || !serverUser.shareLibrary) {
			Logger.log("**Command**: LFG | Requesting user is not sharing library or not in server");
			return [];
		}

		// Step 5: Find users in the server who own the game and are sharing their library
		const users = await User.findAll({
			include: {
				model: DiscordServerUser,
				as: 'serverUsers',
				where: { serverId: server.id, shareLibrary: true },
			},
		});
		Logger.log("**Command**: LFG | Found", users.length, "users sharing library in server");
		return users;

	} catch (error) {
		Logger.error("**Command**: LFG | Error finding players:", error);
		throw new Error("Error finding players");
	}
}

module.exports = lfgCommand;
