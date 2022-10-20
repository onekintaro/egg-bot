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
const { AttachmentBuilder, ApplicationCommandOptionType, PermissionsBitField: { Flags } } = require('discord.js'), { Embed } = require('../../utils'), { post } = require('axios'), Command = require('../../structures/Command.js');
// image types
const image_1 = ['3000years', 'approved', 'beautiful', 'brazzers', 'burn', 'challenger', 'circle', 'contrast', 'crush', 'ddungeon', 'dictator', 'distort', 'emboss', 'fire', 'frame', 'gay',
    'glitch', 'greyscale', 'instagram', 'invert', 'jail', 'magik', 'missionpassed', 'moustache', 'ps4', 'posterize', 'rejected', 'redple', 'rip', 'scary', 'sepia', 'sharpen', 'sniper', 'thanos',
    'tobecontinued', 'triggered', 'subzero', 'unsharpen', 'utatoo', 'wanted', 'wasted'];
const image_2 = ['afusion', 'batslap', 'vs'];
/**
 * Generate command
 * @extends {Command}
*/
class Generate extends Command {
    /**
     * @param {Client} client The instantiating client
     * @param {CommandData} data The data for the command
    */
    constructor(bot) {
        super(bot, {
            name: 'generate',
            dirname: __dirname,
            aliases: ['gen'],
            botPermissions: [Flags.SendMessages, Flags.EmbedLinks, Flags.AttachFiles],
            description: 'Generate a custom image.',
            usage: 'generate <option> [image]',
            cooldown: 5000,
            examples: ['generate 3000years username', 'generate beautiful <attachment>', 'generate list'],
            slash: true,
            options: [{
                    name: 'option',
                    description: 'Option',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    choices: [{ name: 'list', value: 'list' }, ...image_1.map(item => ({ name: item, value: item })), ...image_2.map(item => ({ name: item, value: item }))].slice(0, 24),
                }, {
                    name: 'user',
                    description: 'User\'s avatar to manipulate.',
                    type: ApplicationCommandOptionType.User,
                    required: false,
                }, {
                    name: 'user2',
                    description: 'Second user\'s avatar to manipulate.',
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
            // If user wants to see generate list
            if (!message.args[0] || ['list', '?'].includes(message.args[0]) || (!image_1.includes(message.args[0]) && !image_2.includes(message.args[0]))) {
                const embed = new Embed(bot, message.guild)
                    .setDescription(message.translate('image/generate:DESC', { IMG_1: `${image_1.join('`, `')}`, IMG_2: `${image_2.join('`, `')}` }));
                return message.channel.send({ embeds: [embed] });
            }
            // Get image, defaults to author's avatar
            const choice = message.args[0];
            message.args.shift();
            const files = yield message.getImage();
            if (!Array.isArray(files))
                return;
            // Check if 2 images are needed
            if (image_2.includes(choice) && !files[1])
                return message.channel.error('image/generate:NEED_2IMG');
            // send 'waiting' message to show bot has recieved message
            const msg = yield message.channel.send(message.translate('misc:GENERATING_IMAGE', {
                EMOJI: message.channel.checkPerm('USE_EXTERNAL_EMOJIS') ? bot.customEmojis['loading'] : ''
            }));
            // get image
            const options = image_1.includes(choice) ? { 'url': files[0] } : { 'avatar': files[1], 'url': files[0] };
            const image = yield post(`https://v1.api.amethyste.moe/generate/${choice}`, options, {
                responseType: 'arraybuffer',
                headers: {
                    'Authorization': `Bearer ${bot.config.api_keys.amethyste}`,
                },
            }).catch(err => {
                // if an error occured
                msg.delete();
                if (message.deletable)
                    message.delete();
                bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
                message.channel.error('misc:ERROR_MESSAGE', { ERROR: err.message });
            });
            // send embed
            try {
                if (!image || !image.data)
                    return;
                const attachment = new AttachmentBuilder(image.data, { name: `${choice}.${choice == 'triggered' ? 'gif' : 'png'}` });
                msg.delete();
                message.channel.send({ files: [attachment] });
            }
            catch (err) {
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
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            const option = args.get('option').value;
            const member = guild.members.cache.get((_b = (_a = args.get('user')) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : interaction.user.id).user.displayAvatarURL({ format: 'png', size: 1024 });
            const member2 = guild.members.cache.get((_d = (_c = args.get('user2')) === null || _c === void 0 ? void 0 : _c.value) !== null && _d !== void 0 ? _d : interaction.user.id).user.displayAvatarURL({ format: 'png', size: 1024 });
            const channel = guild.channels.cache.get(interaction.channelId);
            yield interaction.reply({ content: guild.translate('misc:GENERATING_IMAGE', {
                    EMOJI: bot.customEmojis['loading']
                }) });
            try {
                if (option == 'list') {
                    const embed = new Embed(bot, guild)
                        .setDescription(guild.translate('image/generate:DESC', { IMG_1: `${image_1.join('`, `')}`, IMG_2: `${image_2.join('`, `')}` }));
                    return interaction.editReply({ content: ' ', embeds: [embed] });
                }
                // generate image
                const options = image_1.includes(option) ? { 'url': member } : { 'avatar': member2, 'url': member };
                const image = yield post(`https://v1.api.amethyste.moe/generate/${option}`, options, {
                    responseType: 'arraybuffer',
                    headers: {
                        'Authorization': `Bearer ${bot.config.api_keys.amethyste}`,
                    },
                });
                // display image
                if (!image || !image.data)
                    return;
                const attachment = new AttachmentBuilder(image.data, { name: `${option}.${option == 'triggered' ? 'gif' : 'png'}` });
                interaction.editReply({ content: ' ', files: [attachment] });
            }
            catch (err) {
                bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
                return interaction.editReply({ content: ' ', embeds: [channel.error('misc:ERROR_MESSAGE', { ERROR: err.message }, true)], ephemeral: true });
            }
        });
    }
}
module.exports = Generate;