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
 * Sticker delete event
 * @event Egglord#StickerDelete
 * @extends {Event}
*/
class StickerDelete extends Event {
    constructor(...args) {
        super(...args, {
            dirname: __dirname,
        });
    }
    /**
     * Function for receiving event.
     * @param {bot} bot The instantiating client
     * @param {Sticker} sticker The sticker that was deleted
     * @readonly
    */
    run(bot, sticker) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            // For debugging
            if (bot.config.debug)
                bot.logger.debug(`Sticker: ${sticker.name} has been deleted in guild: ${sticker.guildId}. (${sticker.type})`);
            // Get server settings / if no settings then return
            const settings = sticker.guild.settings;
            if (Object.keys(settings).length == 0)
                return;
            // Check if event channelCreate is for logging
            if (((_a = settings.ModLogEvents) === null || _a === void 0 ? void 0 : _a.includes('STICKERDELETE')) && settings.ModLog) {
                const embed = new Embed(bot, sticker.guild)
                    .setDescription(`**Sticker deleted: ${sticker.name}**`)
                    .setColor(15158332)
                    .setImage(`https://cdn.discordapp.com/stickers/${sticker.id}.png`)
                    .setFooter({ text: sticker.guild.translate('misc:ID', { ID: sticker.id }) })
                    .setAuthor({ name: bot.user.username, iconURL: bot.user.displayAvatarURL() })
                    .setTimestamp();
                // Find channel and send message
                try {
                    const modChannel = yield bot.channels.fetch(settings.ModLogChannel).catch(() => bot.logger.error(`Error fetching guild: ${sticker.guildId} logging channel`));
                    if (modChannel && modChannel.guild.id == sticker.guildId)
                        bot.addEmbed(modChannel.id, [embed]);
                }
                catch (err) {
                    bot.logger.error(`Event: '${this.conf.name}' has error: ${err.message}.`);
                }
            }
        });
    }
}
module.exports = StickerDelete;