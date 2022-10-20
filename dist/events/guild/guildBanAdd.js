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
 * Guild ban add event
 * @event Egglord#GuildBanAdd
 * @extends {Event}
    */
class GuildBanAdd extends Event {
    constructor(...args) {
        super(...args, {
            dirname: __dirname,
        });
    }
    /**
     * Function for receiving event.
     * @param {bot} bot The instantiating client
     * @param {GuildBan} ban The ban that occurred
     * @readonly
    */
    run(bot, guildBan) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            // Make sure all relevant data is fetched
            try {
                if (guildBan.partial)
                    yield guildBan.fetch();
                if (guildBan.user.partial)
                    yield guildBan.user.fetch();
            }
            catch (err) {
                if (['Missing Permissions', 'Missing Access'].includes(err.message))
                    return;
                return bot.logger.error(`Event: '${this.conf.name}' has error: ${err.message}.`);
            }
            const { guild, user } = guildBan;
            // For debugging
            if (bot.config.debug)
                bot.logger.debug(`Member: ${user.tag} has been banned in guild: ${guild.id}.`);
            // Get server settings / if no settings then return
            const settings = guild.settings;
            if (Object.keys(settings).length == 0)
                return;
            // Check if event guildBanAdd is for logging
            if (((_a = settings.ModLogEvents) === null || _a === void 0 ? void 0 : _a.includes('GUILDBANADD')) && settings.ModLog) {
                const embed = new Embed(bot, guild)
                    .setDescription(`User: ${user.toString()}`)
                    .setColor(15158332)
                    .setAuthor({ name: 'User banned:', iconURL: user.displayAvatarURL() })
                    .setThumbnail(user.displayAvatarURL())
                    .addFields({ name: 'Reason:', value: (_b = guildBan.reason) !== null && _b !== void 0 ? _b : 'No reason given' })
                    .setTimestamp()
                    .setFooter({ text: `ID: ${user.id}` });
                // Find channel and send message
                try {
                    const modChannel = yield bot.channels.fetch(settings.ModLogChannel).catch(() => bot.logger.error(`Error fetching guild: ${guild.id} logging channel`));
                    if (modChannel && modChannel.guild.id == guild.id)
                        bot.addEmbed(modChannel.id, [embed]);
                }
                catch (err) {
                    bot.logger.error(`Event: '${this.conf.name}' has error: ${err.message}.`);
                }
            }
        });
    }
}
module.exports = GuildBanAdd;
