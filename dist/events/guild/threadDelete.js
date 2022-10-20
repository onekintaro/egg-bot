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
 * Thread delete event
 * @event Egglord#ThreadDelete
 * @extends {Event}
*/
class ThreadDelete extends Event {
    constructor(...args) {
        super(...args, {
            dirname: __dirname,
        });
    }
    /**
     * Function for receiving event.
     * @param {bot} bot The instantiating client
     * @param {ThreadChannel} thread The thread that was deleted
     * @readonly
    */
    run(bot, thread) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            // For debugging
            if (bot.config.debug)
                bot.logger.debug(`Thread: ${thread.name} has been deleted in guild: ${thread.guildId}. (${thread.type.split('_')[1]})`);
            // Get server settings / if no settings then return
            const settings = thread.guild.settings;
            if (Object.keys(settings).length == 0)
                return;
            // Check if event channelCreate is for logging
            if (((_a = settings.ModLogEvents) === null || _a === void 0 ? void 0 : _a.includes('THREADDELETE')) && settings.ModLog) {
                const embed = new Embed(bot, thread.guild)
                    .setDescription([
                    `**${thread.type.split('_')[1].toLowerCase()} thread deleted: ${thread.toString()}**`,
                    '',
                    `Owner: ${(_b = bot.users.cache.get(thread.ownerId)) === null || _b === void 0 ? void 0 : _b.tag}`,
                ].join('\n'))
                    .setColor(15158332)
                    .setFooter({ text: thread.guild.translate('misc:ID', { ID: thread.id }) })
                    .setAuthor({ name: bot.user.username, iconURL: bot.user.displayAvatarURL() })
                    .setTimestamp();
                // Find channel and send message
                try {
                    const modChannel = yield bot.channels.fetch(settings.ModLogChannel).catch(() => bot.logger.error(`Error fetching guild: ${thread.guild.id} logging channel`));
                    if (modChannel && modChannel.guild.id == thread.guild.id)
                        bot.addEmbed(modChannel.id, [embed]);
                }
                catch (err) {
                    bot.logger.error(`Event: '${this.conf.name}' has error: ${err.message}.`);
                }
            }
        });
    }
}
module.exports = ThreadDelete;
