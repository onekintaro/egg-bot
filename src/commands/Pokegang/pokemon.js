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
class Pokemon extends Command {
	/**
 	 * @param {Client} client The instantiating client
 	 * @param {CommandData} data The data for the command
	*/
	constructor(bot) {
		super(bot, {
			name: 'pokemon',
			dirname: __dirname,
			botPermissions: [Flags.SendMessages, Flags.EmbedLinks],
			description: 'Get Pokémon infos by National Dex Number or Name.',
			usage: 'pokemon <pokemon>',
			cooldown: 1000,
			examples: ['pokemon 6', 'pokemon 25'],
			slash: true,
			options: [{
				name: 'pokemon',
				description: 'The Pokémon National Dex Number to gather information on.',
				type: ApplicationCommandOptionType.String,
				required: true,
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
		let pokemon = message.args.join(' ');
		if (!pokemon) {
			if (message.deletable) message.delete();
			return message.channel.error('misc:INCORRECT_FORMAT', { EXAMPLE: settings.prefix.concat(message.translate('fun/pokemon:USAGE')) }).then(m => m.timedDelete({ timeout: 5000 }));
		}

		// send 'waiting' message to show bot has recieved message
		const msg = await message.channel.send(message.translate('misc:FETCHING', {
			EMOJI: message.channel.checkPerm('USE_EXTERNAL_EMOJIS') ? bot.customEmojis['loading'] : '', ITEM: this.help.name }));

		// Search for pokemon
		const pokedex = new PokedexFunctions(bot, this.help);
		if(!pokemon.match(/^\d+$/)) {
			pokemon = pokedex.getIdFromName(pokemon);
		}
		try {
			const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon}`).then(info => {
				if(info.ok) {
					return info.json();
				} else {
					return {
						id: 0,
						names: '???',
						genera: '???',
						flavor_text_entries: '???',
					};
				}
			});
			const base = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`).then(data => {
				if(data.ok) {
					return data.json();
				} else {
					return {
						id: 0,
						types: '???',
					};
				}
			});
			const dex = await pokedex.getDex(res.flavor_text_entries);
			const weakness = await pokedex.getWeakness(base.types);
			const hash = (+new Date * Math.random()).toString(36).substring(0, 10);

			// Send response to channel
			const embed = new EmbedBuilder()
				.setColor(0xFF0000)
				.setTitle(`#${pokedex.padZero(res.id)} - **${pokedex.getName(res.names)}**`)
				.setAuthor({ name: 'Pokedex', iconURL: 'https://static.pokegang.ch/ui/pokedex.png' })
				.setDescription(dex + '\n' + weakness)
				.addFields(
					{ name: 'Typ', value: pokedex.getTypes(base.types), inline: true },
					{ name: 'Spezies', value: pokedex.getSpecies(res.genera), inline: true },
				)
				.addFields({ name: 'Links', value: pokedex.getLinks(res), inline: false })
				.setThumbnail(`https://static.pokegang.ch/pokemon/${res.id}.png`)
				.setImage(`https://static.pokegang.ch/pokedex-${res.id}-${hash}.png`);
			msg.delete();
			message.channel.send({ embeds: [embed] });
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
			pokemon = args.get('pokemon').value;

		await interaction.deferReply({ content: 'Bot is thinking...' });
		// Search for pokemon
		const pokedex = new PokedexFunctions(bot, this.help);
		try {
			const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon}`).then(info => {
				if(info.ok) {
					return info.json();
				} else {
					return {
						id: 0,
						names: '???',
						genera: '???',
						flavor_text_entries: '???',
					};
				}
			});
			const base = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`).then(data => {
				if(data.ok) {
					return data.json();
				} else {
					return {
						id: 0,
						types: '???',
					};
				}
			});
			const dex = await pokedex.getDex(res.flavor_text_entries);
			const weakness = await pokedex.getWeakness(base.types);
			const hash = (+new Date * Math.random()).toString(36).substring(0, 10);

			// Send response to channel
			const embed = new EmbedBuilder()
				.setColor(0xFF0000)
				.setTitle(`#${pokedex.padZero(res.id)} - **${pokedex.getName(res.names)}**`)
				.setAuthor({ name: 'Pokedex', iconURL: 'https://static.pokegang.ch/ui/pokedex.png' })
				.setDescription(dex + '\n' + weakness)
				.addFields(
					{ name: 'Typ', value: pokedex.getTypes(base.types), inline: true },
					{ name: 'Spezies', value: pokedex.getSpecies(res.genera), inline: true },
				)
				.addFields({ name: 'Links', value: pokedex.getLinks(res), inline: false })
				.setThumbnail(`https://static.pokegang.ch/pokemon/${res.id}.png`)
				.setImage(`https://static.pokegang.ch/pokedex-${res.id}-${hash}.png`);
			return await interaction.editReply({ embeds: [embed] });
		} catch (err) {
			// An error occured when looking for account
			bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
			return interaction.editReply({ embeds: [channel.error('misc:ERROR_MESSAGE', { ERROR: err.message }, true)], ephemeral: true });
		}
	}
}

module.exports = Pokemon;
