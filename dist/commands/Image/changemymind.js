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
const { Embed } = require('../../utils'), fetch = require('node-fetch'), { ApplicationCommandOptionType, PermissionsBitField: { Flags } } = require('discord.js'), Command = require('../../structures/Command.js');
/**
 * ChangeMyMind command
 * @extends {Command}
*/
class ChangeMyMind extends Command {
    /**
     * @param {Client} client The instantiating client
     * @param {CommandData} data The data for the command
    */
    constructor(bot) {
        super(bot, {
            name: 'changemymind',
            dirname: __dirname,
            aliases: ['cmm'],
            botPermissions: [Flags.SendMessages, Flags.EmbedLinks],
            description: 'Create a change my mind image.',
            usage: 'changemymind <text>',
            cooldown: 5000,
            examples: ['changemymind Egglord is the greatest'],
            slash: true,
            options: [{
                    name: 'text',
                    description: 'Phrase to use',
                    type: ApplicationCommandOptionType.String,
                    maxLength: 81,
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
            // Get text
            const text = message.args.join(' ');
            // make sure text was entered
            if (!text)
                return message.channel.error('misc:INCORRECT_FORMAT', { EXAMPLE: settings.prefix.concat(message.translate('image/changemymind:USAGE')) });
            // make sure the text isn't longer than 80 characters
            if (text.length >= 81)
                return message.channel.error('image/changemymind:TOO_LONG');
            // send 'waiting' message to show bot has recieved message
            const msg = yield message.channel.send(message.translate('misc:GENERATING_IMAGE', {
                EMOJI: message.channel.checkPerm('USE_EXTERNAL_EMOJIS') ? bot.customEmojis['loading'] : ''
            }));
            // Try and convert image
            try {
                const json = yield fetch(encodeURI(`https://nekobot.xyz/api/imagegen?type=changemymind&text=${text}`)).then(res => res.json());
                // send image
                const embed = new Embed(bot, message.guild)
                    .setColor(2067276)
                    .setImage(json.message);
                message.channel.send({ embeds: [embed] });
            }
            catch (err) {
                if (message.deletable)
                    message.delete();
                bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
                message.channel.error('misc:ERROR_MESSAGE', { ERROR: err.message });
            }
            msg.delete();
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
            const text = args.get('text').value, channel = guild.channels.cache.get(interaction.channelId);
            yield interaction.reply({ content: guild.translate('misc:GENERATING_IMAGE', { EMOJI: bot.customEmojis['loading'] }) });
            try {
                const json = yield fetch(encodeURI(`https://nekobot.xyz/api/imagegen?type=changemymind&text=${text}`)).then(res => res.json());
                const embed = new Embed(bot, guild)
                    .setColor(3447003)
                    .setImage(json.message);
                interaction.editReply({ content: ' ', embeds: [embed] });
            }
            catch (err) {
                bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
                return interaction.editReply({ content: ' ', embeds: [channel.error('misc:ERROR_MESSAGE', { ERROR: err.message }, true)], ephemeral: true });
            }
        });
    }
}
module.exports = ChangeMyMind;