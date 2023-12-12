import { Interaction, CommandInteraction, CommandInteractionOptionResolver, SlashCommandBuilder, StringSelectMenuInteraction, AutocompleteInteraction, ButtonBuilder, ButtonStyle, ButtonInteraction, AnySelectMenuInteraction } from 'discord.js';
import { StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } from 'discord.js';

import Command from '../interfaces/Command';
import config from '../config'
import Caller from '../utils/caller';
import Game from '../interfaces/game';
import EmbeddedGame from '../utils/embeddedGame';

const lfgCommand: Command = {
	data: new SlashCommandBuilder()
		.setName('lfg')
		.setDescription('Find users who own a game')
		.addStringOption(option => option.setName('game')
			.setDescription('The game to search for')
			.setAutocomplete(true)
			.setRequired(true)) as SlashCommandBuilder,

	async autoComplete(interaction: Interaction) {
		const action = interaction as AutocompleteInteraction;

		const name = action.options.getFocused();
		console.log(name);

		const games = await Caller.findGame(name);
		console.log(games);
		action.respond(games.data.map((game: Game) => ({ name: game.name, value: String(game.id) })));
	},

	async execute(interaction: Interaction) {

		let action = interaction as CommandInteraction;
		const options = action.options as CommandInteractionOptionResolver
		const gameId = options.getString('game');
		const serverId = interaction.guildId!;
		const userId = interaction.user.id;
		console.log("Starting Game search for " + gameId + " on server " + interaction.guild?.name + "...")
		if (!gameId) {
			await action.reply('No game provided');
			return;
		}

		try {
			const data = await Caller.find(gameId, serverId, userId);

			switch (data.data) {
				case 'Not Sharing':
					await action.reply({ content: `Use /sharing, or visit the [Dashboard](${config.baseURL}) to turn on Library Sharing for this server to continue.`, ephemeral: true });
					return;
				case 'Server not found':
					await Caller.registerServer(serverId, action.guild!.name, action.guild!.iconURL() ?? '');
					this.execute(interaction);
					return;
				case 'Server User not Registered':
					await Caller.registerUser(serverId, userId, action.user.username);
					this.execute(interaction);
					return;
			}

			const users = data.data['data'] ?? [];

			if (users.length === 0) {
				await action.reply({ content: 'No users found with that game', ephemeral: true });
				return;
			}
			const selectMenu = new StringSelectMenuBuilder()
				.setCustomId('lfg')
				.setPlaceholder('Select a user to message')
				.setMinValues(1)
				.setMaxValues(users.length);
			selectMenu.addOptions(users.map((user: any) => {
				return new StringSelectMenuOptionBuilder()
					.setLabel(user.discord_name)
					.setValue(user.discord_id)
					.setDescription(user.discord_name);
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
				components: [selectRow as any], //, buttonRow as any
				ephemeral: true
			});

			const collectorFilter = (interaction: AnySelectMenuInteraction | ButtonInteraction) =>
				interaction.user.id === interaction.user.id;

			const selection = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });
			const gameData = await Caller.getGame(gameId);
			const game = gameData.data as Game;
			console.log(game);
			if (selection.isStringSelectMenu()) {
				const selectedValues: string[] = selection.values;

				// Build the username string
				const selectedUserNames: string[] = users
					.filter((user: any) => selectedValues.includes(user.discord_id))
					.map((user: any) => user.discord_id);

				action.deleteReply();
				let stringBuilder: string[] = [];
				selectedUserNames.forEach((id: string) => {
					stringBuilder.push(`<@${id}>`);
				});

				action.channel?.send(`<@${interaction.user.id}> would like to play ${game.name} with ${stringBuilder.join(' ')}.`);

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

module.exports = lfgCommand;