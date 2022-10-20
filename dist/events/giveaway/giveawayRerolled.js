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
const { EmbedBuilder } = require('discord.js'), Event = require('../../structures/Event');
/**
 * Giveaway rerolled event
 * @event GiveawaysManager#GiveawayRerolled
 * @extends {Event}
*/
class GiveawayRerolled extends Event {
    constructor(...args) {
        super(...args, {
            dirname: __dirname,
            child: 'giveawaysManager',
        });
    }
    /**
     * Function for receiving event.
     * @param {bot} bot The instantiating client
     * @param {Giveaway} giveaway The giveaway object
     * @param {Array<GuildMember>} winners The member that added the reaction
     * @readonly
    */
    run(bot, giveaway, winners) {
        return __awaiter(this, void 0, void 0, function* () {
            if (bot.config.debug)
                bot.logger.log('giveaway has rerolled');
            // DM members that they have won
            for (const winner of winners) {
                try {
                    const embed = new EmbedBuilder()
                        .setAuthor({ name: 'Giveaway winner', iconURL: winner.user.displayAvatarURL() })
                        .setThumbnail(bot.guilds.cache.get(giveaway.guildID).iconURL())
                        .setDescription([
                        `Prize: \`${giveaway.prize}\`.`,
                        `Message link: [link](https://discord.com/channels/${giveaway.guildID}/${giveaway.channelID}/${giveaway.messageID}).`,
                    ].join('\n'));
                    yield winner.send({ embeds: [embed] });
                }
                catch (err) {
                    bot.logger.error(`Event: '${this.conf.name}' has error: ${err.message}.`);
                }
            }
        });
    }
}
module.exports = GiveawayRerolled;
