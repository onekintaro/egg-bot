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
const { time: { getTotalTime, getReadableTime } } = require('../../utils'), { ApplicationCommandOptionType, PermissionsBitField: { Flags } } = require('discord.js'), Command = require('../../structures/Command.js');
/**
 * Slowmode command
 * @extends {Command}
*/
class Slowmode extends Command {
    /**
     * @param {Client} client The instantiating client
     * @param {CommandData} data The data for the command
    */
    constructor(bot) {
        super(bot, {
            name: 'slowmode',
            guildOnly: true,
            dirname: __dirname,
            aliases: ['slow-mode'],
            userPermissions: [Flags.ManageChannels],
            botPermissions: [Flags.SendMessages, Flags.EmbedLinks, Flags.ManageChannels],
            description: 'Activate slowmode on a channel.',
            usage: 'slowmode <time / off>',
            cooldown: 5000,
            examples: ['slowmode off', 'slowmode 1m'],
            slash: false,
            options: [
                {
                    name: 'input',
                    description: 'How long for slowmode',
                    type: ApplicationCommandOptionType.String,
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
            // get time
            let time;
            if (message.args[0] == 'off') {
                time = 0;
            }
            else if (message.args[0]) {
                const { error, success } = getTotalTime(message.args[0]);
                if (error)
                    return message.channel.error(error);
                time = success;
            }
            else {
                return message.channel.error('misc:INCORRECT_FORMAT', { EXAMPLE: settings.prefix.concat(message.translate('moderation/slowmode:USAGE')) });
            }
            // Activate slowmode
            try {
                yield message.channel.setRateLimitPerUser(time / 1000);
                message.channel.success('moderation/slowmode:SUCCESS', { TIME: time == 0 ? message.translate('misc:OFF') : getReadableTime(time) });
            }
            catch (err) {
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
            const input = args.get('input'), channel = guild.channels.cache.get(interaction.channelId);
            // get time
            let time;
            if (input == 'off') {
                time = 0;
            }
            else if (input) {
                const { error, success } = getTotalTime(args.get('input').value);
                if (error)
                    return interaction.reply({ embeds: [channel.error(error, null, true)] });
                time = success;
            }
            // Activate slowmode
            try {
                yield channel.setRateLimitPerUser(time / 1000);
                interaction.reply({ embeds: [channel.error('moderation/slowmode:SUCCESS', { TIME: time == 0 ? guild.translate('misc:OFF') : getReadableTime(time) }, true)] });
            }
            catch (err) {
                bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
                interaction.reply({ embeds: [channel.error('misc:ERROR_MESSAGE', { ERROR: err.message }, true)] });
            }
        });
    }
}
module.exports = Slowmode;
