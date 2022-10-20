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
 * Message reaction remove all event
 * @event Egglord#MessageReactionRemoveAll
 * @extends {Event}
*/
class MessageReactionRemoveAll extends Event {
    constructor(...args) {
        super(...args, {
            dirname: __dirname,
        });
    }
    /**
     * Function for receiving event.
     * @param {bot} bot The instantiating client
     * @param {Message} message The message the reactions were removed from
     * @readonly
    */
    run(bot, message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            // For debugging
            if (bot.config.debug)
                bot.logger.debug(`Message all reactions removed ${!message.guild ? '' : ` in guild: ${message.guild.id}`}`);
            // If message needs to be fetched
            try {
                if (message.partial)
                    yield message.fetch();
            }
            catch (err) {
                return bot.logger.error(`Event: '${this.conf.name}' has error: ${err.message}.`);
            }
            // Get server settings / if no settings then return
            const settings = message.guild.settings;
            if (Object.keys(settings).length == 0)
                return;
            // Check if event messageReactionRemove is for logging
            if (((_a = settings.ModLogEvents) === null || _a === void 0 ? void 0 : _a.includes('MESSAGEREACTIONREMOVEALL')) && settings.ModLog) {
                const embed = new Embed(bot, message.guild)
                    .setDescription(`**All reactions removed from [this message](${message.url})** `)
                    .setColor(15158332)
                    .setTimestamp();
                // Find channel and send message
                try {
                    const modChannel = yield bot.channels.fetch(settings.ModLogChannel).catch(() => bot.logger.error(`Error fetching guild: ${message.guild.id} logging channel`));
                    if (modChannel && modChannel.guild.id == message.guild.id)
                        bot.addEmbed(modChannel.id, [embed]);
                }
                catch (err) {
                    bot.logger.error(`Event: '${this.conf.name}' has error: ${err.message}.`);
                }
            }
        });
    }
}
module.exports = MessageReactionRemoveAll;
