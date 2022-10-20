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
const { AttachmentBuilder, ApplicationCommandOptionType, PermissionsBitField: { Flags } } = require('discord.js'), { Embed } = require('../../utils'), Command = require('../../structures/Command.js');
/**
 * QRCode command
 * @extends {Command}
*/
class QRcode extends Command {
    /**
     * @param {Client} client The instantiating client
     * @param {CommandData} data The data for the command
    */
    constructor(bot) {
        super(bot, {
            name: 'qrcode',
            dirname: __dirname,
            aliases: ['qr-code'],
            botPermissions: [Flags.SendMessages, Flags.EmbedLinks],
            description: 'Create a QR code.',
            usage: 'qrcode <text / file>',
            cooldown: 5000,
            examples: ['qrcode https://www.google.com/', 'qrcode <attachment>'],
            slash: true,
            options: [{
                    name: 'text',
                    description: 'URL',
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
            // Get text for QR encoding (including file URl)
            const text = (!message.args[0]) ? yield message.getImage().then(r => r[0]) : message.args.join(' ');
            // send 'waiting' message to show bot has recieved message
            const msg = yield message.channel.send(message.translate('misc:GENERATING_IMAGE', {
                EMOJI: message.channel.checkPerm('USE_EXTERNAL_EMOJIS') ? bot.customEmojis['loading'] : ''
            }));
            // Try and convert image
            try {
                const attachment = new AttachmentBuilder(`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${text.replace(/ /g, '%20')}`, { name: 'QRCODE.png' });
                // send image in embed
                const embed = new Embed(bot, message.guild)
                    .setImage('attachment://QRCODE.png');
                message.channel.send({ embeds: [embed], files: [attachment] });
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
                const attachment = new AttachmentBuilder(`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${text.replace(/ /g, '%20')}`, { name: 'QRCODE.png' });
                const embed = new Embed(bot, guild)
                    .setImage('attachment://QRCODE.png');
                interaction.editReply({ content: ' ', embeds: [embed], files: [attachment] });
            }
            catch (err) {
                bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
                return interaction.editReply({ content: ' ', embeds: [channel.error('misc:ERROR_MESSAGE', { ERROR: err.message }, true)], ephemeral: true });
            }
        });
    }
}
module.exports = QRcode;