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
 * Warn command
 * @extends {Command}
*/
class Warn extends Command {
    /**
     * @param {Client} client The instantiating client
     * @param {CommandData} data The data for the command
    */
    constructor(bot) {
        super(bot, {
            name: 'warn',
            guildOnly: true,
            dirname: __dirname,
            aliases: ['warning'],
            userPermissions: [Flags.KickMembers],
            botPermissions: [Flags.SendMessages, Flags.EmbedLinks, Flags.KickMembers],
            description: 'Warn a user.',
            usage: 'warn <user> [time] [reason]',
            cooldown: 5000,
            examples: ['warn username', 'warn username 3m bad'],
            slash: true,
            options: [
                {
                    name: 'user',
                    description: 'The user to mute.',
                    type: ApplicationCommandOptionType.User,
                    required: true,
                },
                {
                    name: 'time',
                    description: 'The time till they are unmuted.',
                    type: ApplicationCommandOptionType.String,
                    required: false,
                },
                {
                    name: 'reason',
                    description: 'The time till they are unmuted.',
                    type: ApplicationCommandOptionType.String,
                    required: false,
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
            // check if a user was entered
            if (!message.args[0])
                return message.channel.error('misc:INCORRECT_FORMAT', { EXAMPLE: settings.prefix.concat(message.translate('moderation/warn:USAGE')) });
            // Get members mentioned in message
            const members = yield message.getMember(false);
            // Make sure atleast a guildmember was found
            if (!members[0])
                return message.channel.error('moderation/ban:MISSING_USER');
            // Make sure user isn't trying to punish themselves
            if (members[0].user.id == message.author.id)
                return message.channel.error('misc:SELF_PUNISH');
            // Make sure user does not have ADMINISTRATOR permissions or has a higher role
            if (members[0].permissions.has('ADMINISTRATOR') || members[0].roles.highest.comparePositionTo(message.guild.members.me.roles.highest) >= 0) {
                return message.channel.error('moderation/warn:TOO_POWERFUL');
            }
            // Get reason for warning
            const reason = message.args[1] ? message.args.splice(1, message.args.length).join(' ') : message.translate('misc:NO_REASON');
            // Warning is sent to warning manager
            try {
                // bot, message, member, wReason, settings
                const res = yield require('../../helpers/warningSystem').run(bot, message, members[0], reason);
                if (res.error)
                    message.channel.error(res.error);
                else
                    message.channel.send({ embeds: [res] });
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
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const member = guild.members.cache.get(args.get('user').value), channel = guild.channels.cache.get(interaction.channelId), reason = (_b = (_a = args.get('reason')) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : guild.translate('misc:NO_REASON');
            // Make sure user isn't trying to punish themselves
            if (member.user.id == interaction.user.id)
                return interaction.reply({ embeds: [channel.error('misc:SELF_PUNISH', {}, true)] });
            // Make sure user does not have ADMINISTRATOR permissions or has a higher role
            if (member.permissions.has('ADMINISTRATOR') || member.roles.highest.comparePositionTo(guild.members.me.roles.highest) >= 0) {
                return interaction.reply({ embeds: [channel.error('moderation/warn:TOO_POWERFUL', {}, true)] });
            }
            try {
                const res = yield require('../../helpers/warningSystem').run(bot, interaction, member, reason);
                if (res.error)
                    interaction.reply({ embeds: [channel.error(res.error, true)] });
                else
                    interaction.reply({ embeds: [res] });
            }
            catch (err) {
                bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
                interaction.reply({ embeds: [channel.error('misc:ERROR_MESSAGE', { ERROR: err.message }, true)] });
            }
        });
    }
}
module.exports = Warn;
