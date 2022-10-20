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
const { AttachmentBuilder, ApplicationCommandOptionType, PermissionsBitField: { Flags } } = require('discord.js'), fetch = require('node-fetch'), Command = require('../../structures/Command.js');
/**
 * Stickbug command
 * @extends {Command}
*/
class Stickbug extends Command {
    /**
     * @param {Client} client The instantiating client
     * @param {CommandData} data The data for the command
    */
    constructor(bot) {
        super(bot, {
            name: 'stickbug',
            dirname: __dirname,
            aliases: ['stick-bug'],
            botPermissions: [Flags.SendMessages, Flags.EmbedLinks, Flags.AttachFiles],
            description: 'Create a stickbug meme.',
            usage: 'stickbug [file]',
            cooldown: 5000,
            examples: ['stickbug username', 'stickbug <attachment>'],
            slash: true,
            options: [{
                    name: 'user',
                    description: 'User\'s avatar to stickbug.',
                    type: ApplicationCommandOptionType.User,
                    required: false,
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
            // Get image, defaults to author's avatar
            const files = yield message.getImage();
            if (!Array.isArray(files))
                return;
            // send 'waiting' message to show bot has recieved message
            const msg = yield message.channel.send(message.translate('misc:GENERATING_IMAGE', {
                EMOJI: message.channel.checkPerm('USE_EXTERNAL_EMOJIS') ? bot.customEmojis['loading'] : ''
            }));
            // Try and convert image
            try {
                const json = yield fetch(encodeURI(`https://nekobot.xyz/api/imagegen?type=stickbug&url=${files[0]}`)).then(res => res.json());
                // send image in embed
                const attachment = new AttachmentBuilder(json.message, { name: 'stickbug.mp4' });
                yield message.channel.send({ files: [attachment] });
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
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const member = guild.members.cache.get((_b = (_a = args.get('user')) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : interaction.user.id), channel = guild.channels.cache.get(interaction.channelId);
            yield interaction.reply({ content: guild.translate('misc:GENERATING_IMAGE', { EMOJI: bot.customEmojis['loading'] }) });
            try {
                const json = yield fetch(encodeURI(`https://nekobot.xyz/api/imagegen?type=stickbug&url=${member.user.displayAvatarURL({ format: 'png', size: 1024 })}`)).then(res => res.json());
                const attachment = new AttachmentBuilder(json.message, { name: 'stickbug.mp4' });
                interaction.editReply({ content: ' ', files: [attachment] });
            }
            catch (err) {
                bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
                return interaction.editReply({ content: ' ', embeds: [channel.error('misc:ERROR_MESSAGE', { ERROR: err.message }, true)], ephemeral: true });
            }
        });
    }
}
module.exports = Stickbug;
