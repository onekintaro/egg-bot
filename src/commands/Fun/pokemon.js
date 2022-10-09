// Dependencies
const { Embed } = require('../../utils'),
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
			description: 'Get Pokémon infos by National Dex Number.',
			usage: 'pokemon <pokemonNo>',
			cooldown: 1000,
			examples: ['pokemon 6', 'pokemon 25'],
			slash: true,
			options: [{
				name: 'pokemon',
				nameLocalized: 'en-US',
				// nameLocalizations: bot.languages.map(({ name }) => ({ [name]: bot.translate(`${this.help.category.toLowerCase()}/${this.help.name}:USAGE`, {}, name) }), bot.commands.get('pokemon')),
				description: 'The Pokémon National Dex Number to gather information on.',
				// descriptionLocalized: 'en-Us',
				//	descriptionLocalizations:bot.languages.map(({ name }) => ({ [name]: bot.translate(`${this.help.category.toLowerCase()}/${this.help.name}:USAGE`, {}, name) }), bot.commands.get('pokemon')),
				type: ApplicationCommandOptionType.Integer,
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
		function padZero(id) {
			if(id == 0) {
				return '????';
			} else {
				return String(id).padStart(4, '0');
			}
		}

		function getName(names) {
			if (names == '???') {
				return 'Unbekanntes Pokémon';
			}
			let found = names.find(element => element.language.name == 'de');
			if (found !== undefined) {
				return found.name;
			} else {
				found = names.find(element => element.language.name == 'en');
				if (found !== undefined) {
					return found.name;
				} else {
					return 'Unbekanntes Pokémon';
				}
			}
		}

		function getSpecies(species) {
			if (species == '???') {
				return '[Unbekannte Spezies]';
			}
			if (species[5] !== undefined) {
				return '[' + species[5].genus + ']';
			} else {
				return '[' + species[6].genus + ']';
			}
		}

		function getDex(dex) {
			if (dex == '???') {
				return '**NO DATA**';
			}
			if (dex[5] !== undefined) {
				return dex[5].name;
			} else {
				return dex[6].name;
			}
		}

		function typeEmoji(type) {
			switch(type) {
				case 'bug':
					return '<:typebug:1028549287543582740>';
				case 'dark':
					return '<:typedark:1028549288797687808>';
				case 'dragon':
					return '<:typedragon:1028549290106290246>';
				case 'electric':
					return '<:typeelectric:1028549291331043338>';
				case 'fairy':
					return '<:typefairy:1028549292476088401>';
				case 'fighting':
					return '<:typefighting:1028549293742764072>';
				case 'fire':
					return '<:typefire:1028549295030407168>';
				case 'flying':
					return '<:typeflying:1028549296393564226> ';
				case 'ghost':
					return '<:typeghost:1028549297853169714>';
				case 'grass':
					return '<:typegrass:1028549299476369448>';
				case 'ground':
					return '<:typeground:1028549301649035264>';
				case 'ice':
					return '<:typeice:1028549302970232863>';
				case 'normal':
					return '<:typenormal:1028549304178200577>';
				case 'poison':
					return '<:typepoison:1028549305503580223>';
				case 'psychic':
					return '<:typepsychic:1028549307235827772>';
				case 'rock':
					return '<:typerock:1028549308712235048>';
				case 'steel':
					return '<:typesteel:1028549311669215232>';
				case 'water':
					return '<:typewater:1028549314559086613>';
				case 'unknown':
					return '<:typeunknown:1028549313057538118>';
				case 'shadow':
					return '<:typeshadow:1028549309756616835>';
				default:
					// code block
			}
		}

		function getTypes(types) {
			if (types == '???') {
				return '<:typeunknown:1028549313057538118>';
			}
			if (types[5] !== undefined) {
				return dex[5].name;
			} else {
				return dex[6].name;
			}
		}

		// Get pokemon
		const pokemon = message.args.join(' ');
		if (!pokemon) {
			if (message.deletable) message.delete();
			return message.channel.error('misc:INCORRECT_FORMAT', { EXAMPLE: settings.prefix.concat(message.translate('fun/pokemon:USAGE')) }).then(m => m.timedDelete({ timeout: 5000 }));
		}

		// send 'waiting' message to show bot has recieved message
		const msg = await message.channel.send(message.translate('misc:FETCHING', {
			EMOJI: message.channel.checkPerm('USE_EXTERNAL_EMOJIS') ? bot.customEmojis['loading'] : '', ITEM: this.help.name }));

		// Search for pokemon

		try {
			const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon}`).then(info => {
				if(info.ok) {
					return info.json();
				} else {
					return {
						id: 0,
						names: '???',
						genera: '???',
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

			// Send response to channel
			const embed = new EmbedBuilder()
				.setColor(0xFF0000)
				.setTitle(`#${padZero(res.id)} - **${getName(res.names)}**`)
				.setAuthor({ name: 'Pokedex', iconURL: 'https://static.pokegang.ch/ui/pokedex.png' })
				// .setDescription(`Type of this pokemon is **${res.info.type}**. ${res.info.description}`)
				.setDescription(`Type of this pokemon is **${getTypes(base.types)}**. TEST`)
				.addFields({ name: 'Typ', value: getTypes(base.types), inline: true })
				.addFields({ name: 'Spezies', value: getSpecies(res.genera), inline: true })
				.setThumbnail(`https://static.pokegang.ch/pokemon/${res.id}.png`)
				.setImage(`https://static.pokegang.ch/pokemon/other/home/${res.id}.png`)
				.setFooter({ text: 'test', iconURL: `https://static.pokegang.ch/pokemon/${res.id}.png` });
				// .setFooter({ text: `Weakness of pokemon - ${res.info.weakness}`, iconURL: `${res.images.weaknessIcon}` });
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

		// Search for pokemon
		try {
			const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon}`).then(info => {
				if(info.ok) {
					info.json();
				} else {
					info = {
						id: '0',
						name: '???',
					};
				}
			});

			// Send response to channel
			// const embed = new Embed(bot, guild)
			// 	.setAuthor({ name: res.name, iconURL: `${res.images.typeIcon}` })
			// 	.setDescription(`Type of this pokemon is **${res.info.type}**. ${res.info.description}`)
			// 	.setThumbnail(`${res.images.photo}`)
			// 	.setFooter({ text:`Weakness of pokemon - ${res.info.weakness}`, iconURL:`${res.images.weaknessIcon}` });
			// return interaction.reply({ embeds: [embed] });
			return interaction.reply({ content: 'TEST' });
		} catch (err) {
			// An error occured when looking for account
			bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
			return interaction.reply({ embeds: [channel.error('misc:ERROR_MESSAGE', { ERROR: err.message }, true)], ephemeral: true });
		}
	}
}

module.exports = Pokemon;
