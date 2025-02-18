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
 * Emoji update event
 * @event Egglord#EmojiUpdate
 * @extends {Event}
*/
class EmojiUpdate extends Event {
    constructor(...args) {
        super(...args, {
            dirname: __dirname,
        });
    }
    /**
     * Function for receiving event.
     * @param {bot} bot The instantiating client
     * @param {GuildEmoji} oldEmoji The emoji before the update
     * @param {GuildEmoji} newEmoji The emoji after the update
     * @readonly
    */
    run(bot, oldEmoji, newEmoji) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            // For debugging
            if (bot.config.debug)
                bot.logger.debug(`Emoji: ${newEmoji.name} has been updated in guild: ${newEmoji.guild.id}.`);
            // Get server settings / if no settings then return
            const settings = newEmoji.guild.settings;
            if (Object.keys(settings).length == 0)
                return;
            // Check if event emojiUpdate is for logging
            if (((_a = settings.ModLogEvents) === null || _a === void 0 ? void 0 : _a.includes('EMOJIUPDATE')) && settings.ModLog) {
                let embed, updated = false;
                // emoji name change
                if (oldEmoji.name != newEmoji.name) {
                    embed = new Embed(bot, newEmoji.guild)
                        .setDescription('**Emoji name update**')
                        .setColor(15105570)
                        .setFooter({ text: `ID: ${newEmoji.id}` })
                        .setAuthor({ name: newEmoji.guild.name, iconURL: newEmoji.guild.iconURL() })
                        .addFields({ name: 'Old:', value: `${oldEmoji.name}`, inline: true }, { name: 'New:', value: `${newEmoji.name}`, inline: true })
                        .setTimestamp();
                    updated = true;
                }
                // emoji role update
                if (oldEmoji.roles.cache.size != newEmoji.roles.cache.size) {
                    const rolesAdded = newEmoji.roles.cache.filter(x => !oldEmoji.roles.cache.get(x.id));
                    const rolesRemoved = oldEmoji.roles.cache.filter(x => !newEmoji.roles.cache.get(x.id));
                    if (rolesAdded.size != 0 || rolesRemoved.size != 0) {
                        const roleAddedString = [];
                        for (const role of [...rolesAdded.values()]) {
                            roleAddedString.push(role.toString());
                        }
                        const roleRemovedString = [];
                        for (const role of [...rolesRemoved.values()]) {
                            roleRemovedString.push(role.toString());
                        }
                        embed = new Embed(bot, newEmoji.guild)
                            .setDescription('**Emoji roles updated**')
                            .setColor(15105570)
                            .setFooter({ text: `ID: ${newEmoji.id}` })
                            .setAuthor({ name: newEmoji.guild.name, iconURL: newEmoji.guild.iconURL() })
                            .addFields({ name: `Added roles [${rolesAdded.size}]:`, value: `${roleAddedString.length == 0 ? '*None*' : roleAddedString.join('\n ')}`, inline: true }, { name: `Removed roles [${rolesRemoved.size}]:`, value: `${roleRemovedString.length == 0 ? '*None*' : roleRemovedString.join('\n ')}`, inline: true })
                            .setTimestamp();
                        updated = true;
                    }
                }
                if (updated) {
                    // Find channel and send message
                    try {
                        const modChannel = yield bot.channels.fetch(settings.ModLogChannel).catch(() => bot.logger.error(`Error fetching guild: ${newEmoji.guild.id} logging channel`));
                        if (modChannel && modChannel.guild.id == newEmoji.guild.id)
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
module.exports = EmojiUpdate;
