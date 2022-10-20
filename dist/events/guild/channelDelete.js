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
const { Embed } = require('../../utils'), { ChannelType } = require('discord-api-types/v10'), Event = require('../../structures/Event');
/**
 * Channel delete event
 * @event Egglord#ChannelDelete
 * @extends {Event}
*/
class ChannelDelete extends Event {
    constructor(...args) {
        super(...args, {
            dirname: __dirname,
        });
    }
    /**
     * Function for receiving event.
     * @param {bot} bot The instantiating client
     * @param {GuildChannel|DMChannel} channel The channel that was deleted
     * @readonly
    */
    run(bot, channel) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            // For debugging
            if (bot.config.debug)
                bot.logger.debug(`Channel: ${channel.type == ChannelType.DM ? channel.recipient.tag : channel.name} has been deleted${channel.type == ChannelType.DM ? '' : ` in guild: ${channel.guild.id}`}. (${ChannelType[channel.type]})`);
            // Don't really know but a check for DM must be made
            if (channel.type == 'dm')
                return;
            // Get server settings / if no settings then return
            const settings = channel.guild.settings;
            if (Object.keys(settings).length == 0)
                return;
            // IF it's a ticket channel and TICKET logging is enabled then don't show CHANNELDELETE log
            const regEx = /ticket-\d{18}/g;
            if (regEx.test(channel.name) && ((_a = settings.ModLogEvents) === null || _a === void 0 ? void 0 : _a.includes('TICKET')))
                return bot.emit('ticketClose', channel);
            // Check if event channelDelete is for logging
            if (((_b = settings.ModLogEvents) === null || _b === void 0 ? void 0 : _b.includes('CHANNELDELETE')) && settings.ModLog) {
                const embed = new Embed(bot, channel.guild)
                    .setDescription(`**${ChannelType[channel.type]} channel deleted: ${'#' + channel.name}**`)
                    .setColor(15158332)
                    .setFooter({ text: `ID: ${channel.id}` })
                    .setAuthor({ name: bot.user.username, iconURL: bot.user.displayAvatarURL() })
                    .setTimestamp();
                // Find channel and send message
                try {
                    const modChannel = yield bot.channels.fetch(settings.ModLogChannel).catch(() => bot.logger.error(`Error fetching guild: ${channel.guild.id} logging channel`));
                    if (modChannel && modChannel.guild.id == channel.guild.id)
                        bot.addEmbed(modChannel.id, [embed]);
                }
                catch (err) {
                    bot.logger.error(`Event: '${this.conf.name}' has error: ${err.message}.`);
                }
            }
        });
    }
}
module.exports = ChannelDelete;
