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
const Event = require('../../structures/Event');
/**
 * Giveaway reaction removed event
 * @event GiveawaysManager#GiveawayReactionRemoved
 * @extends {Event}
*/
class GiveawayReactionRemoved extends Event {
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
     * @param {GuildMember} member The member that added the reaction
     * @param {MessageReaction} reaction The reaction object
     * @readonly
    */
    run(bot, giveaway, member, reaction) {
        return __awaiter(this, void 0, void 0, function* () {
            if (bot.config.debug)
                bot.logger.debug(`member: ${member.user.id} removed reaction ${reaction._emoji.name} to giveaway`);
        });
    }
}
module.exports = GiveawayReactionRemoved;
