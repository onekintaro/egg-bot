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
 * Thread members update event
 * @event Egglord#ThreadMembersUpdate
 * @extends {Event}
*/
class ThreadMembersUpdate extends Event {
    constructor(...args) {
        super(...args, {
            dirname: __dirname,
        });
    }
    /**
     * Function for receiving event.
     * @param {bot} bot The instantiating client
     * @param {Collection<Snowflake, ThreadMember>} oldMembers The members before the update
     * @param {Collection<Snowflake, ThreadMember>} newMembers The members after the update
     * @readonly
    */
    run(bot, oldMembers, newMembers) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            // Get thread
            const thread = (_b = (_a = oldMembers.first()) === null || _a === void 0 ? void 0 : _a.thread) !== null && _b !== void 0 ? _b : newMembers.first().thread;
            // For debugging
            if (bot.config.debug)
                bot.logger.debug(`Thread: ${thread.name} member count has been updated in guild: ${thread.guildId}. (${thread.type.split('_')[1]})`);
            // Get server settings / if no settings then return
            const settings = thread.guild.settings;
            if (Object.keys(settings).length == 0)
                return;
            // Check if event channelDelete is for logging
            if (((_c = settings.ModLogEvents) === null || _c === void 0 ? void 0 : _c.includes('THREADMEMBERSUPDATE')) && settings.ModLog) {
                // emoji role update
                if (oldMembers.size != newMembers.size) {
                    const memberAdded = newMembers.filter(x => !oldMembers.get(x.id));
                    const memberRemoved = oldMembers.filter(x => !newMembers.get(x.id));
                    if (memberAdded.size != 0 || memberRemoved.size != 0) {
                        const memberAddedString = [];
                        for (const role of [...memberAdded.values()]) {
                            memberAddedString.push(thread.guild.members.cache.get(role.id));
                        }
                        const memberRemovedString = [];
                        for (const role of [...memberRemoved.values()]) {
                            memberRemovedString.push(thread.guild.members.cache.get(role.id));
                        }
                        // create embed
                        const embed = new Embed(bot, thread.guild)
                            .setDescription(`**Thread members updated in ${thread.toString()}**`)
                            .setColor(15105570)
                            .setFooter({ text: `ID: ${thread.id}` })
                            .setAuthor({ name: thread.guild.name, iconURL: thread.guild.iconURL() })
                            .addFields({ name: `Added members [${memberAdded.size}]:`, value: `${memberAddedString.length == 0 ? '*None*' : memberAddedString.join('\n ')}`, inline: true }, { name: `Removed member [${memberRemoved.size}]:`, value: `${memberRemovedString.length == 0 ? '*None*' : memberRemovedString.join('\n ')}`, inline: true })
                            .setTimestamp();
                        // Find channel and send message
                        try {
                            const modChannel = yield bot.channels.fetch(settings.ModLogChannel).catch(() => bot.logger.error(`Error fetching guild: ${thread.guildId} logging channel`));
                            if (modChannel && modChannel.guild.id == thread.guildId)
                                bot.addEmbed(modChannel.id, [embed]);
                        }
                        catch (err) {
                            bot.logger.error(`Event: '${this.conf.name}' has error: ${err.message}.`);
                        }
                    }
                }
            }
        });
    }
}
module.exports = ThreadMembersUpdate;
