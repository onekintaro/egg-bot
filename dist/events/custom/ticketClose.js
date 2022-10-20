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
const { Embed } = require('../../utils'), Event = require('../../structures/Event');
/**
 * Ticket close event
 * @event Egglord#TickteClose
 * @extends {Event}
*/
class TicketClose extends Event {
    constructor(...args) {
        super(...args, {
            dirname: __dirname,
        });
    }
    /**
     * Function for receiving event.
     * @param {bot} bot The instantiating client
     * @param {TextChannel} channel The ticket channel that closed
     * @readonly
    */
    run(bot, channel) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            // Get server settings / if no settings then return
            const settings = channel.guild.settings;
            if (Object.keys(settings).length == 0)
                return;
            // send ticket log (goes in ModLog channel)
            if (((_a = settings.ModLogEvents) === null || _a === void 0 ? void 0 : _a.includes('TICKET')) && settings.ModLog) {
                const embed = new Embed(bot, channel.guild)
                    .setTitle('ticket/ticket-close:TITLE')
                    .setColor(15158332)
                    .addFields({ name: channel.guild.translate('ticket/ticket-close:TICKET'), value: channel.toString() }, { name: channel.guild.translate('ticket/ticket-close:USER'), value: `${bot.users.cache.get(channel.name.split('-')[1])}` })
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
module.exports = TicketClose;
