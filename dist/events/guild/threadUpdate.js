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
 * Thread update event
 * @event Egglord#ThreadUpdate
 * @extends {Event}
*/
class ThreadUpdate extends Event {
    constructor(...args) {
        super(...args, {
            dirname: __dirname,
        });
    }
    /**
     * Function for receiving event.
     * @param {bot} bot The instantiating client
     * @param {ThreadChannel} oldThread The thread before the update
     * @param {ThreadChannel} newThread The thread after the update
     * @readonly
    */
    run(bot, oldThread, newThread) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            // For debugging
            if (bot.config.debug)
                bot.logger.debug(`Thread: ${newThread.name} has been updated in guild: ${newThread.guildId}. (${newThread.type.split('_')[1]})`);
            // Get server settings / if no settings then return
            const settings = newThread.guild.settings;
            if (Object.keys(settings).length == 0)
                return;
            // Check if event channelCreate is for logging
            if (((_a = settings.ModLogEvents) === null || _a === void 0 ? void 0 : _a.includes('THREADUPDATE')) && settings.ModLog) {
                let embed, updated = false;
                // thread name change
                if (oldThread.name != newThread.name) {
                    embed = new Embed(bot, newThread.guild)
                        .setDescription(`**Thread name changed of ${newThread.toString()}**`)
                        .setColor(15105570)
                        .setFooter({ text: `ID: ${newThread.id}` })
                        .setAuthor({ name: newThread.guild.name, iconURL: newThread.guild.iconURL() })
                        .addFields({ name: 'Old:', value: `${oldThread.name}`, inline: true }, { name: 'New:', value: `${newThread.name}`, inline: true })
                        .setTimestamp();
                    updated = true;
                }
                // thread archive state change
                if (oldThread.archived != newThread.archived) {
                    embed = new Embed(bot, newThread.guild)
                        .setDescription(`**Thread archive state changed of ${newThread.toString()}**`)
                        .setColor(15105570)
                        .setFooter({ text: `ID: ${newThread.id}` })
                        .setAuthor({ name: newThread.guild.name, iconURL: newThread.guild.iconURL() })
                        .addFields({ name: 'Old:', value: `${oldThread.archived}`, inline: true }, { name: 'New:', value: `${newThread.archived}`, inline: true })
                        .setTimestamp();
                    updated = true;
                }
                // Find channel and send message
                if (updated) {
                    try {
                        const modChannel = yield bot.channels.fetch(settings.ModLogChannel).catch(() => bot.logger.error(`Error fetching guild: ${newThread.guild.id} logging channel`));
                        if (modChannel && modChannel.guild.id == newThread.guild.id)
                            bot.addEmbed(modChannel.id, [embed]);
                    }
                    catch (err) {
                        bot.logger.error(`Event: '${this.conf.name}' has error: ${err.message}.`);
                    }
                }
            }
        });
    }
}
module.exports = ThreadUpdate;
