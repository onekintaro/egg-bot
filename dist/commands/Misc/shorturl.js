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
const { shorten } = require('tinyurl'), { ApplicationCommandOptionType, PermissionsBitField: { Flags } } = require('discord.js'), Command = require('../../structures/Command.js');
/**
 * ShortURL command
 * @extends {Command}
*/
class ShortURL extends Command {
    /**
     * @param {Client} client The instantiating client
     * @param {CommandData} data The data for the command
    */
    constructor(bot) {
        super(bot, {
            name: 'shorturl',
            dirname: __dirname,
            aliases: ['surl', 'short-url'],
            botPermissions: [Flags.SendMessages, Flags.EmbedLinks],
            description: 'Creates a shorturl on the URL you sent.',
            usage: 'shorturl',
            cooldown: 3000,
            examples: ['shorturl https://www.google.com', 'shorturl https://www.youtube.com'],
            slash: true,
            options: [{
                    name: 'url',
                    description: 'The specified URL to shorten.',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                }],
        });
    }
    /**
     * Function for receiving message.
     * @param {bot} bot The instantiating client
     * @param {message} message The message that ran the command
     * @readonly
    */
    run(bot, message) {
        return __awaiter(this, void 0, void 0, function* () {
            const mes = message.content.split(' ').slice(1).join(' ');
            // send 'waiting' message to show bot has recieved message
            const msg = yield message.channel.send(message.translate('misc:FETCHING', {
                EMOJI: message.channel.checkPerm('USE_EXTERNAL_EMOJIS') ? bot.customEmojis['loading'] : '', ITEM: this.help.name
            }), { tts: true });
            try {
                shorten(mes, function (res) {
                    msg.delete();
                    message.channel.send(res);
                });
            }
            catch (err) {
                if (message.deletable)
                    message.delete();
                bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
                msg.delete();
                message.channel.error('misc:ERROR_MESSAGE', { ERROR: err.message });
            }
        });
    }
    /**
     * Function for receiving interaction.
     * @param {bot} bot The instantiating client
     * @param {interaction} interaction The interaction that ran the command
     * @param {guild} guild The guild the interaction ran in
     * @param {args} args The options provided in the command, if any
     * @readonly
    */
    callback(bot, interaction, guild, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const channel = guild.channels.cache.get(interaction.channelId), link = args.get('url').value;
            try {
                yield shorten(link, function (res) {
                    return interaction.reply({ content: res });
                });
            }
            catch (err) {
                bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
                interaction.reply({ embeds: [channel.error('misc:ERROR_MESSAGE', { ERROR: err.message }, true)], ephemeral: true });
            }
        });
    }
}
module.exports = ShortURL;
