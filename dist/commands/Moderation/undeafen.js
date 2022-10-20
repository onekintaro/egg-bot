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
const { ApplicationCommandOptionType, PermissionsBitField: { Flags } } = require('discord.js'), Command = require('../../structures/Command.js');
/**
 * Undeafen command
 * @extends {Command}
*/
class Undeafen extends Command {
    /**
     * @param {Client} client The instantiating client
     * @param {CommandData} data The data for the command
    */
    constructor(bot) {
        super(bot, {
            name: 'undeafen',
            guildOnly: true,
            dirname: __dirname,
            aliases: ['undeaf', 'un-deafen'],
            userPermissions: [Flags.DeafenMembers],
            botPermissions: [Flags.SendMessages, Flags.EmbedLinks, Flags.DeafenMembers],
            description: 'Undeafen a user.',
            usage: 'undeafen <user>',
            cooldown: 2000,
            examples: ['undeafen username'],
            slash: false,
            options: [
                {
                    name: 'user',
                    description: 'The user to undeafen.',
                    type: ApplicationCommandOptionType.User,
                    required: true,
                },
            ],
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
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            // Delete message
            if (settings.ModerationClearToggle && message.deletable)
                message.delete();
            // Checks to make sure user is in the server
            const members = yield message.getMember();
            // Make sure that the user is in a voice channel
            if ((_a = members[0]) === null || _a === void 0 ? void 0 : _a.voice.channel) {
                // Make sure bot can deafen members
                if (!members[0].voice.channel.permissionsFor(bot.user).has(Flags.DeafenMembers)) {
                    bot.logger.error(`Missing permission: \`DEAFEN_MEMBERS\` in [${message.guild.id}].`);
                    return message.channel.error('misc:MISSING_PERMISSION', { PERMISSIONS: message.translate('permissions:DEAFEN_MEMBERS') });
                }
                // Make sure user isn't trying to punish themselves
                if (members[0].user.id == message.author.id)
                    return message.channel.error('misc:SELF_PUNISH');
                try {
                    yield members[0].voice.setDeaf(false);
                    message.channel.success('moderation/undeafen:SUCCESS', { USER: members[0].user });
                }
                catch (err) {
                    if (message.deletable)
                        message.delete();
                    bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
                    message.channel.error('misc:ERROR_MESSAGE', { ERROR: err.message });
                }
            }
            else {
                message.channel.error('moderation/undeafen:NOT_VC');
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
            const member = guild.members.cache.get(args.get('user').value), channel = guild.channels.cache.get(interaction.channelId);
            // Make sure that the user is in a voice channel
            if (member.voice.channel) {
                // Make sure bot can deafen members
                if (!member.voice.channel.permissionsFor(bot.user).has(Flags.DeafenMembers)) {
                    bot.logger.error(`Missing permission: \`DEAFEN_MEMBERS\` in [${guild.id}].`);
                    return interaction.reply({ embeds: [channel.error('misc:MISSING_PERMISSION', { PERMISSIONS: guild.translate('permissions:DEAFEN_MEMBERS') }, true)] });
                }
                // Make sure user isn't trying to punish themselves
                if (member.user.id == interaction.user.id)
                    return interaction.reply({ embeds: [channel.error('misc:SELF_PUNISH', null, true)] });
                try {
                    yield member.voice.setDeaf(false);
                    interaction.reply({ embeds: [channel.success('moderation/undeafen:SUCCESS', { USER: member.user }, true)] });
                }
                catch (err) {
                    bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
                    interaction.reply({ embeds: [channel.error('misc:ERROR_MESSAGE', { ERROR: err.message }, true)] });
                }
            }
            else {
                interaction.reply({ embeds: [channel.error('moderation/undeafen:NOT_VC', null, true)] });
            }
        });
    }
}
module.exports = Undeafen;