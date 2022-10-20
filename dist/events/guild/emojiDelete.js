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
 * Emoji delete event
 * @event Egglord#EmojiDelete
 * @extends {Event}
*/
class EmojiDelete extends Event {
    constructor(...args) {
        super(...args, {
            dirname: __dirname,
        });
    }
    /**
     * Function for receiving event.
     * @param {bot} bot The instantiating client
     * @param {GuildEmoji} emoji The emoji that was deleted
     * @readonly
    */
    run(bot, emoji) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            // For debugging
            if (bot.config.debug)
                bot.logger.debug(`Emoji: ${emoji.name} has been deleted in guild: ${emoji.guild.id}.`);
            // Get server settings / if no settings then return
            const settings = emoji.guild.settings;
            if (Object.keys(settings).length == 0)
                return;
            // Check if event emojiDelete is for logging
            if (((_a = settings.ModLogEvents) === null || _a === void 0 ? void 0 : _a.includes('EMOJIDELETE')) && settings.ModLog) {
                const embed = new Embed(bot, emoji.guild)
                    .setDescription(`**Emoji: ${emoji} (${emoji.name}) was deleted**`)
                    .setColor(15158332)
                    .setFooter({ text: `ID: ${emoji.id}` })
                    .setAuthor({ name: emoji.guild.name, iconURL: emoji.guild.iconURL() })
                    .setTimestamp();
                // Find channel and send message
                try {
                    const modChannel = yield bot.channels.fetch(settings.ModLogChannel).catch(() => bot.logger.error(`Error fetching guild: ${emoji.guild.id} logging channel`));
                    if (modChannel && modChannel.guild.id == emoji.guild.id)
                        bot.addEmbed(modChannel.id, [embed]);
                }
                catch (err) {
                    bot.logger.error(`Event: '${this.conf.name}' has error: ${err.message}.`);
                }
            }
        });
    }
}
module.exports = EmojiDelete;
