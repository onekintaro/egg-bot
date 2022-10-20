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
const { time: { getTotalTime } } = require('../../utils'), { ApplicationCommandOptionType, PermissionsBitField: { Flags } } = require('discord.js'), Command = require('../../structures/Command.js');
/**
 * Giveaway edit command
 * @extends {Command}
*/
class GiveawayEdit extends Command {
    /**
   * @param {Client} client The instantiating client
   * @param {CommandData} data The data for the command
  */
    constructor(bot) {
        super(bot, {
            name: 'g-edit',
            guildOnly: true,
            dirname: __dirname,
            aliases: ['giveaway-edit', 'gedit'],
            userPermissions: [Flags.ManageGuild],
            botPermissions: [Flags.SendMessages, Flags.EmbedLinks],
            description: 'Edit a giveaway.',
            usage: 'g-edit <messageID> <AddedTime> <newWinnerCount> <NewPrize>',
            cooldown: 2000,
            examples: ['g-edit 818821436255895612 2m 2 nitro', 'g-edit 818821436255895612 3h40m 5 nitro classic'],
            slash: false,
            options: [
                {
                    name: 'id',
                    description: 'Message ID of the giveaway.',
                    type: ApplicationCommandOptionType.Integer,
                    required: true,
                },
                {
                    name: 'time',
                    description: 'Extra time added to the giveaway.',
                    type: ApplicationCommandOptionType.Integer,
                    required: false,
                },
                {
                    name: 'winners',
                    description: 'New winner count.',
                    type: ApplicationCommandOptionType.Integer,
                    minValue: 1,
                    maxValue: 10,
                    required: false,
                },
                {
                    name: 'prize',
                    description: 'New prize',
                    type: ApplicationCommandOptionType.String,
                    maxLength: 256,
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
            // Make sure the message ID of the giveaway embed is entered
            if (message.args.length <= 3)
                return message.channel.error('misc:INCORRECT_FORMAT', { EXAMPLE: settings.prefix.concat(message.translate('giveaway/g-edit:USAGE')) });
            // Get new Time
            const { error, success: time } = getTotalTime(message.args[0]);
            if (error)
                return message.channel.error(error);
            // Get new winner count
            if (isNaN(message.args[2]))
                return message.channel.error('giveaway/g-edit:INCORRECT_WINNER_COUNT');
            // Update giveaway
            try {
                yield bot.giveawaysManager.edit(message.args[0], {
                    newWinnerCount: parseInt(message.args[2]),
                    newPrize: message.args.slice(3).join(' '),
                    addTime: time,
                });
                message.channel.send(bot.translate('giveaway/g-edit:EDIT_GIVEAWAY', { TIME: bot.giveawaysManager.options.updateCountdownEvery / 1000 }));
            }
            catch (err) {
                bot.logger.error(`Command: 'g-edit' has error: ${err}.`);
                message.channel.send(bot.translate('giveaway/g-edit:UNKNOWN_GIVEAWAY', { ID: message.args[0] }));
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
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const channel = guild.channels.cache.get(interaction.channelId), id = args.get('id').value, winners = (_a = args.get('winners')) === null || _a === void 0 ? void 0 : _a.value, prize = (_b = args.get('prize')) === null || _b === void 0 ? void 0 : _b.value;
            // Make sure a time, winner or prize was inputted or no point editing the file.
            if (!time && !winners && !prize)
                return interaction.reply({ embeds: [channel.error('giveaway/g-edit:NOTHING_TO_EDIT')], fetchReply: true }).then(m => m.timedDelete({ timeout: 5000 }));
            const { error, success: time } = getTotalTime((_c = args.get('time').value) !== null && _c !== void 0 ? _c : 0);
            if (error)
                return interaction.reply({ embeds: [channel.error(error, null, true)] });
            // Update giveaway
            try {
                yield bot.giveawaysManager.edit(id, {
                    newWinnerCount: winners !== null && winners !== void 0 ? winners : bot.giveawaysManager.giveaways.find(g => g.messageID == id).winnerCount,
                    newPrize: prize !== null && prize !== void 0 ? prize : bot.giveawaysManager.giveaways.find(g => g.messageID == id).prize,
                    addTime: time,
                });
                interaction.reply({ embeds: [channel.success('giveaway/g-edit:EDIT_GIVEAWAY', { TIME: bot.giveawaysManager.options.updateCountdownEvery / 1000 }, true)] });
            }
            catch (err) {
                bot.logger.error(`Command: 'g-edit' has error: ${err}.`);
                interaction.reply(bot.translate('giveaway/g-edit:UNKNOWN_GIVEAWAY', { ID: id }));
            }
        });
    }
}
module.exports = GiveawayEdit;
