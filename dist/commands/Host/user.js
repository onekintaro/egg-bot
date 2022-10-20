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
const { EmbedBuilder, ApplicationCommandOptionType, PermissionsBitField: { Flags } } = require('discord.js'), { userSchema } = require('../../database/models'), moment = require('moment'), axios = require('axios'), Command = require('../../structures/Command.js');
/**
 * User command
 * @extends {Command}
*/
class User extends Command {
    /**
     * @param {Client} client The instantiating client
     * @param {CommandData} data The data for the command
    */
    constructor(bot) {
        super(bot, {
            name: 'user',
            ownerOnly: true,
            dirname: __dirname,
            botPermissions: [Flags.SendMessages, Flags.EmbedLinks],
            description: 'Edit a user\'s data',
            usage: 'user <id> [premium / banned / rank / reset] [true / false]',
            cooldown: 3000,
            examples: ['user 184376969016639488 premium true'],
            slash: false,
            options: [{
                    name: 'track',
                    description: 'The link or name of the track.',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    autocomplete: true,
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
            let user;
            try {
                user = yield bot.users.fetch(message.args[0]);
            }
            catch (err) {
                if (message.deletable)
                    message.delete();
                bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
                message.channel.error('Invalid user ID.');
            }
            if (!user)
                return;
            // Display user information
            if (!message.args[1]) {
                const embed = new EmbedBuilder()
                    .setTitle('User Information:')
                    .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL({ dynamic: true, size: 1024 }) })
                    .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 1024 }))
                    .setDescription([
                    `Username: \`${user.tag}\``,
                    `ID: \`${user.id}\``,
                    `Creation Date: \`${moment(user.createdAt).format('lll')}\``,
                    '',
                    `Premium: \`${user.premium}\`${user.premium ? ` (${(new Date(parseInt(user.premiumSince)).toLocaleString()).split(',')[0]})` : ''}.`,
                    `Is banned: \`${user.cmdBanned}\``,
                    `No. of mutual servers: \`${bot.guilds.cache.filter(g => g.members.cache.get(user.id)).size}\``,
                ].join('\n'));
                return message.channel.send({ embeds: [embed] });
            }
            // find input
            switch (message.args[1].toLowerCase()) {
                case 'premium':
                    // Update the user's premium
                    try {
                        if (!['true', 'false'].includes(message.args[2].toLowerCase()))
                            return message.channel.error('misc:INCORRECT_FORMAT', { EXAMPLE: settings.prefix.concat(message.translate('host/user:USAGE')) }).then(m => m.timedDelete({ timeout: 5000 }));
                        const resp = yield userSchema.findOne({ userID: user.id });
                        if (!resp) {
                            yield (new userSchema({
                                userID: user.id,
                                premium: message.args[2],
                                premiumSince: Date.now(),
                            })).save();
                        }
                        else {
                            yield userSchema.findOneAndUpdate({ userID: user.id }, { premium: message.args[2], premiumSince: Date.now() });
                        }
                        user.premium = message.args[2];
                        message.channel.success('host/user:SUCCESS_PREM').then(m => m.timedDelete({ timeout: 10000 }));
                    }
                    catch (err) {
                        if (message.deletable)
                            message.delete();
                        bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
                        message.channel.error('misc:ERROR_MESSAGE', { ERROR: err.message });
                    }
                    break;
                case 'banned':
                    // Update the user's global ban
                    try {
                        if (!['true', 'false'].includes(message.args[2].toLowerCase()))
                            return message.channel.error('misc:INCORRECT_FORMAT', { EXAMPLE: settings.prefix.concat(message.translate('host/user:USAGE')) }).then(m => m.timedDelete({ timeout: 5000 }));
                        const resp = yield userSchema.findOne({ userID: user.id });
                        if (!resp) {
                            yield (new userSchema({
                                userID: user.id,
                                cmdBanned: message.args[2],
                            })).save();
                        }
                        else {
                            yield userSchema.findOneAndUpdate({ userID: user.id }, { cmdBanned: message.args[2] });
                        }
                        user.cmdBanned = message.args[2];
                        message.channel.success('host/user:SUCCESS_BAN').then(m => m.timedDelete({ timeout: 10000 }));
                    }
                    catch (err) {
                        if (message.deletable)
                            message.delete();
                        bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
                        message.channel.error('misc:ERROR_MESSAGE', { ERROR: err.message });
                    }
                    break;
                case 'rank':
                    // Update user's rank card
                    if (message.attachments.first().url) {
                        try {
                            const response = yield axios.get(message.attachments.first().url, { responseType: 'arraybuffer' });
                            if (!['png', 'jpeg'].includes(response.headers['content-type'].replace('image/', '')))
                                return message.channel.error(`File type must be \`PNG\` or \`JPEG\`, this file type was: ${response.headers['content-type'].replace('image/', '')}`).then(m => m.timedDelete({ timeout: 5000 }));
                            const resp = yield userSchema.findOne({ userID: user.id });
                            if (!resp) {
                                yield (new userSchema({
                                    userID: user.id,
                                    rankImage: Buffer.from(response.data, 'utf-8'),
                                })).save();
                            }
                            else {
                                yield userSchema.findOneAndUpdate({ userID: user.id }, { rankImage: Buffer.from(response.data, 'utf-8') });
                            }
                            user.rankImage = Buffer.from(response.data, 'utf-8');
                            message.channel.success('host/user:SUCCESS_RANK').then(m => m.timedDelete({ timeout: 10000 }));
                        }
                        catch (err) {
                            if (message.deletable)
                                message.delete();
                            bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
                            message.channel.error('misc:ERROR_MESSAGE', { ERROR: err.message });
                        }
                    }
                    else {
                        return message.channel.error('Please upload either a PNG or JPEG file with the command.').then(m => m.timedDelete({ timeout: 5000 }));
                    }
                    break;
                case 'reset':
                    try {
                        yield userSchema.findOneAndRemove({ userID: user.id });
                        user.premium = false;
                        user.cmdBanned = false;
                        user.rankImage = '';
                        message.channel.success('host/user:SUCCESS_RESET').then(m => m.timedDelete({ timeout: 10000 }));
                    }
                    catch (err) {
                        if (message.deletable)
                            message.delete();
                        bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
                        message.channel.error('misc:ERROR_MESSAGE', { ERROR: err.message });
                    }
                    break;
                default:
                    message.channel.error('misc:INCORRECT_FORMAT', { EXAMPLE: settings.prefix.concat(message.translate('host/user:USAGE')) }).then(m => m.timedDelete({ timeout: 5000 }));
                    break;
            }
        });
    }
    /**
     * Function for receiving interaction.
     * @param {bot} bot The instantiating client
     * @param {interaction} interaction The interaction that ran the command
     * @param {guild} guild The guild the interaction ran in
     * @readonly
    */
    callback(bot, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            interaction.reply({ content: 'This is currently unavailable.' });
        });
    }
}
module.exports = User;