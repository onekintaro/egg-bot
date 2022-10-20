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
 * Giveaway delete command
 * @extends {Command}
*/
class GiveawayDelete extends Command {
    /**
   * @param {Client} client The instantiating client
   * @param {CommandData} data The data for the command
  */
    constructor(bot) {
        super(bot, {
            name: 'g-delete',
            guildOnly: true,
            dirname: __dirname,
            aliases: ['giveaway-delete', 'gdelete'],
            userPermissions: [Flags.ManageGuild],
            botPermissions: [Flags.SendMessages, Flags.EmbedLinks],
            description: 'Delete a giveaway',
            usage: 'g-delete <messageID>',
            cooldown: 2000,
            examples: ['g-delete 818821436255895612'],
            slash: false,
            options: [
                {
                    name: 'id',
                    description: 'Message ID of the giveaway.',
                    type: ApplicationCommandOptionType.Integer,
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
            // Make sure the message ID of the giveaway embed is entered
            if (!message.args[0])
                return message.channel.error('misc:INCORRECT_FORMAT', { EXAMPLE: settings.prefix.concat(message.translate('giveaway/g-delete:USAGE')) });
            // Delete the giveaway
            const messageID = message.args[0];
            try {
                yield bot.giveawaysManager.delete(messageID);
                message.channel.send(bot.translate('giveaway/g-delete:SUCCESS_GIVEAWAY'));
            }
            catch (err) {
                bot.logger.error(`Command: 'g-delete' has error: ${err}.`);
                message.channel.send(bot.translate('giveaway/g-delete:UNKNOWN_GIVEAWAY', { ID: messageID }));
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
            const channel = guild.channels.cache.get(interaction.channelId), messageID = args.get('messageID').value;
            // Delete the giveaway
            try {
                yield bot.giveawaysManager.delete(messageID);
                interaction.reply({ embeds: [channel.success('giveaway/g-delete:SUCCESS_GIVEAWAY', {}, true)] });
            }
            catch (err) {
                bot.logger.error(`Command: 'g-delete' has error: ${err}.`);
                interaction.reply(bot.translate('giveaway/g-delete:UNKNOWN_GIVEAWAY', { ID: messageID }));
            }
        });
    }
}
module.exports = GiveawayDelete;
