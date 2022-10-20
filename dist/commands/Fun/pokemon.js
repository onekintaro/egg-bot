"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Dependencies
const { Embed, PokedexFunctions } = require('../../utils'), fetch = require('node-fetch'), { ApplicationCommandOptionType, PermissionsBitField: { Flags } } = require('discord.js'), Command = require('../../structures/Command.js');
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
    run(bot, message, settings) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get pokemon
            const pokemon = message.args.join(' ');
            if (!pokemon) {
                if (message.deletable)
                    message.delete();
                return message.channel.error('misc:INCORRECT_FORMAT', { EXAMPLE: settings.prefix.concat(message.translate('fun/pokemon:USAGE')) }).then(m => m.timedDelete({ timeout: 5000 }));
            }
            // send 'waiting' message to show bot has recieved message
            const msg = yield message.channel.send(message.translate('misc:FETCHING', {
                EMOJI: message.channel.checkPerm('USE_EXTERNAL_EMOJIS') ? bot.customEmojis['loading'] : '', ITEM: this.help.name
            }));
            // Search for pokemon
            const pokedex = new PokedexFunctions(bot, message, this.help, msg);
            try {
                const res = yield fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon}`).then(info => {
                    if (info.ok) {
                        return info.json();
                    }
                    else {
                        return {
                            id: 0,
                            names: '???',
                            genera: '???',
                            flavor_text_entries: '???',
                        };
                    }
                });
                const base = yield fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`).then(data => {
                    if (data.ok) {
                        return data.json();
                    }
                    else {
                        return {
                            id: 0,
                            types: '???',
                        };
                    }
                });
                const dex = yield pokedex.getDex(res.flavor_text_entries);
                const weakness = yield pokedex.getWeakness(base.types, true);
                // Send response to channel
                const embed = new EmbedBuilder()
                    .setColor(0xFF0000)
                    .setTitle(`#${pokedex.padZero(res.id)} - **${pokedex.getName(res.names)}**`)
                    .setAuthor({ name: 'Pokedex', iconURL: 'https://static.pokegang.ch/ui/pokedex.png' })
                    .setDescription(dex + '\n' + weakness)
                    .addFields({ name: 'Typ', value: pokedex.getTypes(base.types), inline: true }, { name: 'Spezies', value: pokedex.getSpecies(res.genera), inline: true })
                    .addFields({ name: 'Links', value: pokedex.getLinks(res), inline: false })
                    .setThumbnail(`https://static.pokegang.ch/pokemon/${res.id}.png`)
                    .setImage(`https://static.pokegang.ch/pokemon-${res.id}.png`);
                msg.delete();
                message.channel.send({ embeds: [embed] });
            }
            catch (err) {
                // An error occured when looking for account
                if (message.deletable)
                    message.delete();
                bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
                msg.delete();
                return message.channel.error('misc:ERROR_MESSAGE', { ERROR: err.message });
            }
        });
    }
    /**
     * Function for receiving interaction.
     * @param {bot} bot The instantiating client
     * @param {interaction} interaction The interaction that ran the command
     * @param {guild} guild The guild the interaction ran in
     * @param {args} args The options provided in the command, if any
     * @returns {embed}
    */
    callback(bot, interaction, guild, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const channel = guild.channels.cache.get(interaction.channelId), pokemon = args.get('pokemon').value;
            // Search for pokemon
            try {
                const res = yield fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon}`).then(info => {
                    if (info.ok) {
                        return info.json();
                    }
                    else {
                        return {
                            id: 0,
                            names: '???',
                            genera: '???',
                        };
                    }
                });
                const base = yield fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`).then(data => {
                    if (data.ok) {
                        return data.json();
                    }
                    else {
                        return {
                            id: 0,
                            types: '???',
                        };
                    }
                });
                const dex = yield getDex(res.flavor_text_entries);
                // Send response to channel
                const embed = new EmbedBuilder()
                    .setColor(0xFF0000)
                    .setTitle(`#${padZero(res.id)} - **${getName(res.names)}**`)
                    .setAuthor({ name: 'Pokedex', iconURL: 'https://static.pokegang.ch/ui/pokedex.png' })
                    .setDescription(dex)
                    .addFields({ name: 'Typ', value: getTypes(base.types), inline: true })
                    .addFields({ name: 'Spezies', value: getSpecies(res.genera), inline: true })
                    .addFields({ name: 'Links', value: `[Pokéwiki](https://www.pokewiki.de/${getName(res.names)}) | [Bisafans](https://www.bisafans.de/pokedex/${padZero(res.id, 3)}.php) | [Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/${getName(res.names, true)}_(Pokémon))`, inline: false })
                    .setThumbnail(`https://static.pokegang.ch/pokemon/${res.id}.png`)
                    .setImage(`https://static.pokegang.ch/pokemon/other/home/${res.id}.png`);
                msg.delete();
                return interaction.reply({ content: 'TEST' });
            }
            catch (err) {
                // An error occured when looking for account
                bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
                return interaction.reply({ embeds: [channel.error('misc:ERROR_MESSAGE', { ERROR: err.message }, true)], ephemeral: true });
            }
        });
    }
}
module.exports = Pokemon;
