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
// Variables
const unavailableGuilds = [], Event = require('../../structures/Event');
/**
 * Guild unavailable event
 * @event Egglord#GuildUnavailable
 * @extends {Event}
*/
class GuildUnavailable extends Event {
    constructor(...args) {
        super(...args, {
            dirname: __dirname,
        });
    }
    /**
     * Function for receiving event.
     * @param {bot} bot The instantiating client
     * @param {Guild} guild The guild that has become unavailable
     * @readonly
    */
    run(bot, guild) {
        return __awaiter(this, void 0, void 0, function* () {
            // For debugging
            if (bot.config.debug)
                bot.logger.debug(`Guild: ${guild.name} has become unavailable.`);
            // only show error once an hour
            if (unavailableGuilds.includes(guild.id)) {
                // remove guild from array after an error
                setTimeout(function () {
                    unavailableGuilds.splice(unavailableGuilds.indexOf(guild.id), 1);
                    // 1 hour interval
                }, 60 * 60 * 1000);
            }
            else {
                bot.logger.log(`[GUILD UNAVAILABLE] ${guild.name} (${guild.id}).`);
                unavailableGuilds.push(guild.id);
            }
        });
    }
}
module.exports = GuildUnavailable;
