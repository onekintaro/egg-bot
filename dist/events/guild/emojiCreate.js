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
 * Emoji create event
 * @event Egglord#EmojiCreate
 * @extends {Event}
*/
class EmojiCreate extends Event {
    constructor(...args) {
        super(...args, {
            dirname: __dirname,
        });
    }
    /**
     * Function for receiving event.
     * @param {bot} bot The instantiating client
     * @param {GuildEmoji} emoji The emoji that was created
     * @readonly
    */
    run(bot, emoji) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            // For debugging
            if (bot.config.debug)
                bot.logger.debug(`Emoji: ${emoji.name} has been created in guild: ${emoji.guild.id}.`);
            // Get server settings / if no settings then return
            const settings = emoji.guild.settings;
            if (Object.keys(settings).length == 0)
                return;
            // Check if event emojiCreate is for logging
            if (((_a = settings.ModLogEvents) === null || _a === void 0 ? void 0 : _a.includes('EMOJICREATE')) && settings.ModLog) {
                const embed = new Embed(bot, emoji.guild)
                    .setDescription(`**Emoji: ${emoji} (${emoji.name}) was created**`)
                    .setColor(3066993)
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
module.exports = EmojiCreate;
