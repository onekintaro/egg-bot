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
const Event = require('../../structures/Event'), { EmbedBuilder } = require('discord.js');
/**
 * Ratelimit event
 * @event Egglord#RateLimit
 * @extends {Event}
*/
class RateLimit extends Event {
    constructor(...args) {
        super(...args, {
            dirname: __dirname,
            child: 'manager',
        });
    }
    /**
     * Function for receiving event.
     * @param {bot} bot The instantiating client
     * @param {object} RateLimitData Object containing the rate limit info
     * @param {string} RateLimitData.route The route of the request relative to the HTTP endpoint
     * @param {number} RateLimitData.timeout Time until this rate limit ends, in ms
     * @readonly
    */
    run(bot, { route, timeout, limit }) {
        return __awaiter(this, void 0, void 0, function* () {
            bot.logger.error(`Rate limit: ${route} (Cooldown: ${timeout}ms)`);
            const embed = new EmbedBuilder()
                .setTitle('RateLimit hit')
                .setColor('RED')
                .addFields({ name: 'Path', value: route }, { name: 'Limit', value: `${limit}`, inline: true }, { name: 'Cooldown', value: `${timeout}ms`, inline: true })
                .setTimestamp();
            const modChannel = yield bot.channels.fetch(bot.config.SupportServer.rateLimitChannelID).catch(() => bot.logger.error('Error fetching rate limit logging channel'));
            if (modChannel)
                bot.addEmbed(modChannel.id, [embed]);
        });
    }
}
module.exports = RateLimit;
