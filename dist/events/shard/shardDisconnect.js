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
 * Shard disconnect event
 * @event Egglord#ShardDisconnect
 * @extends {Event}
*/
class ShardDisconnect extends Event {
    constructor(...args) {
        super(...args, {
            dirname: __dirname,
        });
    }
    /**
     * Function for receiving event.
     * @param {bot} bot The instantiating client
     * @param {CloseEvent} event The WebSocket close event
     * @param {number} shardID The shard id that disconnected
     * @readonly
    */
    run(bot, event, shardID) {
        return __awaiter(this, void 0, void 0, function* () {
            bot.logger.error(`Shard: ${shardID} disconnected with error: ${event.reason}`);
        });
    }
}
module.exports = ShardDisconnect;
