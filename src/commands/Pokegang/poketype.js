// Dependencies
const { Embed, PokedexFunctions } = require('../../utils'),
	fetch = require('node-fetch'),
	{ ApplicationCommandOptionType, PermissionsBitField: { Flags } } = require('discord.js'),
	Command = require('../../structures/Command.js');
const { EmbedBuilder } = require('discord.js');

/**
 * Pokemon command
 * @extends {Command}
*/
class PokeType extends Command {
	/**
 	 * @param {Client} client The instantiating client
 	 * @param {CommandData} data The data for the command
	*/
	constructor(bot) {
		super(bot, {
			name: 'ptype',
			name_localizations: {
				de: 'ptyp',
			},
			dirname: __dirname,
			botPermissions: [Flags.SendMessages, Flags.EmbedLinks],
			description: 'Get Pokémon-Type infos',
			description_localizations: {
				de: 'Erhalte Infos über einen Pokémon Typ',
			},
			usage: 'ptype <type>',
			cooldown: 1000,
			examples: ['type <:typebug:1028549287543582740>', 'type bug', 'type käfer'],
			slash: true,
			options: [{
				name: 'type',
				name_localizations: {
					de: 'typ',
				},
				description: 'Input Type',
				description_localizations: {
					de: 'Typ eingeben',
				},
				type: ApplicationCommandOptionType.String,
				required: true,
				choices: [
					{
						name: 'Normal',
						name_localizations: {
							de: 'Normal',
						},
						value: 'normal',
					},
					{
						name: 'Fighting',
						name_localizations: {
							de: 'Kampf',
						},
						value: 'fighting',
					},
					{
						name: 'Flying',
						name_localizations: {
							de: 'Flug',
						},
						value: 'flying',
					},
					{
						name: 'Poison',
						name_localizations: {
							de: 'Gift',
						},
						value: 'poison',
					},
					{
						name: 'Ground',
						name_localizations: {
							de: 'Boden',
						},
						value: 'ground',
					},
					{
						name: 'Rock',
						name_localizations: {
							de: 'Gestein',
						},
						value: 'rock',
					},
					{
						name: 'Bug',
						name_localizations: {
							de: 'Käfer',
						},
						value: 'bug',
					},
					{
						name: 'Ghost',
						name_localizations: {
							de: 'Geist',
						},
						value: 'ghost',
					},
					{
						name: 'Steel',
						name_localizations: {
							de: 'Stahl',
						},
						value: 'steel',
					},
					{
						name: 'Fire',
						name_localizations: {
							de: 'Feuer',
						},
						value: 'fire',
					},
					{
						name: 'Water',
						name_localizations: {
							de: 'Wasser',
						},
						value: 'fire',
					},
					{
						name: 'Grass',
						name_localizations: {
							de: 'Pflanze',
						},
						value: 'grass',
					},
					{
						name: 'Electric',
						name_localizations: {
							de: 'Elektro',
						},
						value: 'electric',
					},
					{
						name: 'Psychic',
						name_localizations: {
							de: 'Psycho',
						},
						value: 'psychic',
					},
					{
						name: 'Ice',
						name_localizations: {
							de: 'Eis',
						},
						value: 'ice',
					},
					{
						name: 'Dragon',
						name_localizations: {
							de: 'Drache',
						},
						value: 'dragon',
					},
					{
						name: 'Dark',
						name_localizations: {
							de: 'Unlicht',
						},
						value: 'dark',
					},
					{
						name: 'Fairy',
						name_localizations: {
							de: 'Fee',
						},
						value: 'fairy',
					},
				],
			}],
		});
	}

	/**
 	 * Function for receiving message.
 	 * @param {bot} bot The instantiating client
 	 * @param {message} message The message that ran the command
	 * @param {settings} settings The settings of the channel the command ran in
 	 * @readonly
  */
	async run(bot, message, settings) {

		// Get pokemon
		const type = message.args.join(' ');
		if (!type) {
			if (message.deletable) message.delete();
			return message.channel.error('misc:INCORRECT_FORMAT', { EXAMPLE: settings.prefix.concat(message.translate('fun/type:USAGE')) }).then(m => m.timedDelete({ timeout: 5000 }));
		}

		// send 'waiting' message to show bot has recieved message
		const msg = await message.channel.send(message.translate('misc:FETCHING', {
			EMOJI: message.channel.checkPerm('USE_EXTERNAL_EMOJIS') ? bot.customEmojis['pokegang'] : '', ITEM: this.help.name }));

		// Search for pokemon
		const pokedex = new PokedexFunctions(bot, this.help);
		try {
			let ty = pokedex.getTypeName(type);
			if(ty !== '???') {
				const types = [{ slot: 1, type: { name: ty.typ } }];
				const weakness = await pokedex.getWeakness(types, true);

				// Send response to channel
				const embed = new EmbedBuilder()
					.setColor(0xFF0000)
					.setTitle(`Typ: **${ty.name}**`)
					.setAuthor({ name: 'Pokedex', iconURL: 'https://static.pokegang.ch/ui/pokedex.png' })
					.setDescription(weakness)
					.setThumbnail(`https://static.pokegang.ch/types/badges/png/${ty.typ}.png`);
				msg.delete();
				message.channel.send({ embeds: [embed] });
			} else {
				// Send response to channel
				const embed = new EmbedBuilder()
					.setColor(0xFF0000)
					.setTitle('Typ: **Unbekannter Typ**')
					.setAuthor({ name: 'Pokedex', iconURL: 'https://static.pokegang.ch/ui/pokedex.png' })
					.setDescription('**[NO DATA]**')
					.setThumbnail('https://static.pokegang.ch/types/badges/png/unknown.png');
				msg.delete();
				message.channel.send({ embeds: [embed] });
			}
		} catch (err) {
			// An error occured when looking for account
			if (message.deletable) message.delete();
			bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
			msg.delete();
			return message.channel.error('misc:ERROR_MESSAGE', { ERROR: err.message });
		}
	}

	/**
 	 * Function for receiving interaction.
 	 * @param {bot} bot The instantiating client
 	 * @param {interaction} interaction The interaction that ran the command
 	 * @param {guild} guild The guild the interaction ran in
 	 * @param {args} args The options provided in the command, if any
 	 * @returns {embed}
	*/
	async callback(bot, interaction, guild, args) {
		const channel = guild.channels.cache.get(interaction.channelId),
			type = args.get('type').value;

		await interaction.deferReply({ content: 'Bot is thinking...' });
		const embed = new EmbedBuilder()
			.setColor(0xFF0000);

		// Search for pokemon
		const pokedex = new PokedexFunctions(bot, this.help);
		try {
			const ty = pokedex.getTypeName(type);
			if(ty !== '???') {
				const types = [{ slot: 1, type: { name: ty.typ } }];
				const weakness = await pokedex.getWeakness(types, true);
				// Send response to channel
				embed
					.setTitle(`Typ: **${ty.name}**`)
					.setAuthor({ name: 'Pokedex', iconURL: 'https://static.pokegang.ch/ui/pokedex.png' })
					.setDescription(weakness)
					.setThumbnail(`https://static.pokegang.ch/types/badges/png/${ty.typ}.png`);
			} else {
				// Send response to channel
				embed
					.setTitle('Typ: **Unbekannter Typ**')
					.setAuthor({ name: 'Pokedex', iconURL: 'https://static.pokegang.ch/ui/pokedex.png' })
					.setDescription('**[NO DATA]**')
					.setThumbnail('https://static.pokegang.ch/types/badges/png/unknown.png');
			}
			return await interaction.editReply({ embeds: [embed] });
		} catch (err) {
			// An error occured when looking for account
			bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
			return interaction.editReply({ embeds: [channel.error('misc:ERROR_MESSAGE', { ERROR: err.message }, true)], ephemeral: true });
		}
	}
}

module.exports = PokeType;
