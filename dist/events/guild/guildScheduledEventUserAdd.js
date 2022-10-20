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
 * Guild event user join event
 * @event Egglord#guildScheduledEventUserAdd
 * @extends {Event}
*/
class GuildScheduledEventUserAdd extends Event {
    constructor(...args) {
        super(...args, {
            dirname: __dirname,
        });
    }
    /**
     * Function for receiving event.
     * @param {bot} bot The instantiating client
     * @param {guildScheduledEvent} guildEvent The guild event the user joined
     * @param {User} user The user who joined the event
     * @readonly
    */
    run(bot, guildEvent, user) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            // Ignore the event if the user that joined was the creator of the event
            if (user.id == guildEvent.creatorId)
                return;
            // For debugging
            if (bot.config.debug)
                bot.logger.debug(`User: ${user.tag} has joined event: ${guildEvent.name} in guild: ${guildEvent.guild.id}.`);
            // Get server settings / if no settings then return
            const settings = guildEvent.guild.settings;
            if (Object.keys(settings).length == 0)
                return;
            // Check if event guildEventCreate is for logging
            if (((_a = settings.ModLogEvents) === null || _a === void 0 ? void 0 : _a.includes('EVENTUSERADD')) && settings.ModLog) {
                const embed = new Embed(bot, guildEvent.guild)
                    .setDescription([
                    `${user.tag} joined event: [${guildEvent.name}](${guildEvent})`,
                    '',
                    `There are now ${(_b = guildEvent.userCount) !== null && _b !== void 0 ? _b : 0} users subscribed to the event.`,
                ].join('\n'))
                    .setColor(3066993)
                    .setFooter({ text: guildEvent.guild.translate('misc:ID', { ID: guildEvent.guild.id }) })
                    .setAuthor({ name: bot.user.username, iconURL: bot.user.displayAvatarURL() })
                    .setTimestamp();
                // Find channel and send message
                try {
                    const modChannel = yield bot.channels.fetch(settings.ModLogChannel).catch(() => bot.logger.error(`Error fetching guild: ${guildEvent.guild.id} logging channel`));
                    if (modChannel && modChannel.guild.id == guildEvent.guild.id)
                        bot.addEmbed(modChannel.id, [embed]);
                }
                catch (err) {
                    bot.logger.error(`Event: '${this.conf.name}' has error: ${err.message}.`);
                }
            }
        });
    }
}
module.exports = GuildScheduledEventUserAdd;
