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
 * Unmute command
 * @extends {Command}
*/
class Unmute extends Command {
    /**
     * @param {Client} client The instantiating client
     * @param {CommandData} data The data for the command
    */
    constructor(bot) {
        super(bot, {
            name: 'unmute',
            guildOnly: true,
            dirname: __dirname,
            aliases: ['un-mute'],
            userPermissions: [Flags.MuteMembers],
            botPermissions: [Flags.SendMessages, Flags.EmbedLinks, Flags.MuteMembers, Flags.ManageRoles],
            description: 'Unmute a user.',
            usage: 'unmute <user>',
            cooldown: 2000,
            examples: ['unmute username'],
            slash: true,
            options: [
                {
                    name: 'user',
                    description: 'The user to mute.',
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
        return __awaiter(this, void 0, void 0, function* () {
            // Delete message
            if (settings.ModerationClearToggle && message.deletable)
                message.delete();
            // Find user
            const members = yield message.getMember();
            // Get the channel the member is in
            const channel = message.guild.channels.cache.get(members[0].voice.channelID);
            if (channel) {
                // Make sure bot can deafen members
                if (!channel.permissionsFor(bot.user).has(Flags.MuteMembers)) {
                    bot.logger.error(`Missing permission: \`MUTE_MEMBERS\` in [${message.guild.id}].`);
                    return message.channel.error('misc:MISSING_PERMISSION', { PERMISSIONS: message.translate('permissions:MUTE_MEMBERS') });
                }
            }
            // Remove mutedRole from user
            try {
                yield members[0].timeout(null, `${message.author.id} put user out of timeout`);
                message.channel.success('moderation/unmute:SUCCESS', { USER: members[0].user });
            }
            catch (err) {
                if (message.deletable)
                    message.delete();
                bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
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
            const member = guild.members.cache.get(args.get('user').value);
            // Get the channel the member is in
            const channel = guild.channels.cache.get(member.voice.channelID);
            if (channel) {
                // Make sure bot can deafen members
                if (!channel.permissionsFor(bot.user).has(Flags.MuteMembers)) {
                    bot.logger.error(`Missing permission: \`MUTE_MEMBERS\` in [${guild.id}].`);
                    return interaction.reply({ embeds: [channel.error('misc:MISSING_PERMISSION', { PERMISSIONS: guild.translate('permissions:MUTE_MEMBERS') }, true)] });
                }
            }
            // Remove mutedRole from user
            try {
                yield member.timeout(null, `${interaction.user.id} put user out of timeout`);
                interaction.reply({ embeds: [channel.error('moderation/unmute:SUCCESS', { USER: member.user }, true)] });
            }
            catch (err) {
                bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
                interaction.reply({ embeds: [channel.error('misc:ERROR_MESSAGE', { ERROR: err.message }, true)] });
            }
        });
    }
}
module.exports = Unmute;
