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
 * Guild update event
 * @event Egglord#GuildUpdate
 * @extends {Event}
*/
class GuildUpdate extends Event {
    constructor(...args) {
        super(...args, {
            dirname: __dirname,
        });
    }
    /**
     * Function for receiving event.
     * @param {bot} bot The instantiating client
     * @param {Guild} oldGuild The guild before the update
     * @param {Guild} newGuild The guild after the update
     * @readonly
    */
    run(bot, oldGuild, newGuild) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            // For debugging
            if (bot.config.debug)
                bot.logger.debug(`Guild: ${newGuild.name} has been updated.`);
            // Get server settings / if no settings then return
            const settings = newGuild.settings;
            if (Object.keys(settings).length == 0)
                return;
            // Check if event guildUpdate is for logging
            if (settings.ModLog && ((_a = settings.ModLogEvents) === null || _a === void 0 ? void 0 : _a.includes('GUILDUPDATE'))) {
                let embed, updated = false;
                // Guild name change
                if (oldGuild.name != newGuild.name) {
                    embed = new Embed(bot, newGuild)
                        .setDescription('**Server name changed**')
                        .setAuthor({ name: newGuild.name, iconURL: newGuild.iconURL() })
                        .addFields({ name: 'Before:', value: oldGuild.name })
                        .addFields({ name: 'After:', value: newGuild.name })
                        .setTimestamp();
                    yield newGuild.updateGuild({ guildName: newGuild.name });
                    settings.guildName = newGuild.name;
                    updated = true;
                }
                // Server's boost level has changed
                if (oldGuild.premiumTier != newGuild.premiumTier) {
                    embed = new Embed(bot, newGuild)
                        .setDescription(`**Server boost ${oldGuild.premiumTier < newGuild.premiumTier ? 'increased' : 'decreased'}**`)
                        .setAuthor({ name: newGuild.name, iconURL: newGuild.iconURL() })
                        .addFields({ name: 'Before:', value: oldGuild.premiumTier })
                        .addFields({ name: 'After:', value: newGuild.premiumTier })
                        .setTimestamp();
                    updated = true;
                }
                // Server has got a new banner
                if (!oldGuild.banner && newGuild.banner) {
                    embed = new Embed(bot, newGuild)
                        .setDescription('**Server banner changed**')
                        .setAuthor({ name: newGuild.name, iconURL: newGuild.iconURL() })
                        .addFields({ name: 'Before:', value: oldGuild.banner })
                        .addFields({ name: 'After:', value: newGuild.banner })
                        .setTimestamp();
                    updated = true;
                }
                // Server has made a AFK channel
                if (!oldGuild.afkChannel && newGuild.afkChannel) {
                    embed = new Embed(bot, newGuild)
                        .setDescription('**Server AFK channel changed**')
                        .setAuthor({ name: newGuild.name, iconURL: newGuild.iconURL() })
                        .addFields({ name: 'Before:', value: oldGuild.afkChannel })
                        .addFields({ name: 'After:', value: newGuild.afkChannel })
                        .setTimestamp();
                    updated = true;
                }
                // Server now has a vanity URL
                if (!oldGuild.vanityURLCode && newGuild.vanityURLCode) {
                    embed = new Embed(bot, newGuild)
                        .setDescription('**Server Vanity URL changed**')
                        .setAuthor({ name: newGuild.name, iconURL: newGuild.iconURL() })
                        .addFields({ name: 'Before:', value: oldGuild.vanityURLCode })
                        .addFields({ name: 'After:', value: newGuild.vanityURLCode })
                        .setTimestamp();
                    updated = true;
                }
                if (updated) {
                    // Find channel and send message
                    try {
                        const modChannel = yield bot.channels.fetch(settings.ModLogChannel).catch(() => bot.logger.error(`Error fetching guild: ${newGuild.id} logging channel`));
                        if (modChannel && modChannel.guild.id == newGuild.id)
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
module.exports = GuildUpdate;
