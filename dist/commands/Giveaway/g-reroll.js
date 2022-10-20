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
 * Giveaway reroll command
 * @extends {Command}
*/
class GiveawayReroll extends Command {
    /**
   * @param {Client} client The instantiating client
   * @param {CommandData} data The data for the command
  */
    constructor(bot) {
        super(bot, {
            name: 'g-reroll',
            guildOnly: true,
            dirname: __dirname,
            aliases: ['giveaway-reroll', 'greroll'],
            userPermissions: [Flags.ManageGuild],
            botPermissions: [Flags.SendMessages, Flags.EmbedLinks],
            description: 'reroll a giveaway.',
            usage: 'g-reroll <messageID> [winners]',
            cooldown: 2000,
            examples: ['g-reroll 818821436255895612'],
            slash: false,
            options: [
                {
                    name: 'id',
                    description: 'Message ID of the giveaway.',
                    type: ApplicationCommandOptionType.Integer,
                    required: true,
                },
                {
                    name: 'winner',
                    description: 'How many winners to reroll.',
                    type: ApplicationCommandOptionType.Integer,
                    minValue: 1,
                    maxValue: 10,
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
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            // Delete message
            if (settings.ModerationClearToggle && message.deletable)
                message.delete();
            // Make sure the message ID of the giveaway embed is entered
            if (!message.args[0])
                return message.channel.error('misc:INCORRECT_FORMAT', { EXAMPLE: settings.prefix.concat(message.translate('giveaway/g-reroll:USAGE')) });
            // re-roll the giveaway
            const messageID = message.args[0];
            try {
                yield bot.giveawaysManager.reroll(messageID, {
                    winnerCount: !parseInt(message.args[1]) ? (_a = bot.giveawaysManager.giveaways.find(g => g.messageID == messageID)) === null || _a === void 0 ? void 0 : _a.winnerCount : parseInt(message.args[1]),
                    messages: {
                        congrat: message.translate('giveaway/g-reroll:CONGRAT'),
                        error: message.translate('giveaway/g-reroll:ERROR'),
                    },
                });
                message.channel.send(bot.translate('giveaway/g-reroll:SUCCESS_GIVEAWAY'));
            }
            catch (err) {
                bot.logger.error(`Command: 'g-reroll' has error: ${err}.`);
                message.channel.send(bot.translate('giveaway/g-reroll:UNKNOWN_GIVEAWAY', { ID: messageID }));
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
            const channel = guild.channels.cache.get(interaction.channelId), messageID = args.get('messageID').value, winners = (_a = args.get('winner')) === null || _a === void 0 ? void 0 : _a.value;
            // re-roll the giveaway
            try {
                yield bot.giveawaysManager.reroll(messageID, {
                    winnerCount: winners !== null && winners !== void 0 ? winners : (_b = bot.giveawaysManager.giveaways.find(g => g.messageID == messageID)) === null || _b === void 0 ? void 0 : _b.winnerCount,
                    messages: {
                        congrat: guild.translate('giveaway/g-reroll:CONGRAT'),
                        error: guild.translate('giveaway/g-reroll:ERROR'),
                    },
                });
                interaction.reply({ embeds: [channel.success('giveaway/g-reroll:SUCCESS_GIVEAWAY', {}, true)] });
            }
            catch (err) {
                bot.logger.error(`Command: 'g-reroll' has error: ${err}.`);
                interaction.reply(bot.translate('giveaway/g-reroll:UNKNOWN_GIVEAWAY', { ID: messageID }));
            }
        });
    }
}
module.exports = GiveawayReroll;
