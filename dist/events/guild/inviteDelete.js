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
 * Invite delete event
 * @event Egglord#InviteDelete
 * @extends {Event}
*/
class InviteDelete extends Event {
    constructor(...args) {
        super(...args, {
            dirname: __dirname,
        });
    }
    /**
     * Function for receiving event.
     * @param {bot} bot The instantiating client
     * @param {Invite} invite The invite that was deleted
     * @readonly
    */
    run(bot, invite) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            // Get server settings / if no settings then return
            const settings = invite.guild.settings;
            if (Object.keys(settings).length == 0)
                return;
            // Check if event guildMemberAdd is for logging
            if (((_a = settings.ModLogEvents) === null || _a === void 0 ? void 0 : _a.includes('INVITEDELETE')) && settings.ModLog) {
                const embed = new Embed(bot, invite.guild)
                    .setDescription('**Invite Deleted**')
                    .setColor(15158332)
                    .setFooter({ text: `Guild ID: ${invite.guild.id}` })
                    .setTimestamp();
                // Find channel and send message
                try {
                    const modChannel = yield bot.channels.fetch(settings.ModLogChannel).catch(() => bot.logger.error(`Error fetching guild: ${invite.guild.id} logging channel`));
                    if (modChannel && modChannel.guild.id == invite.guild.id)
                        bot.addEmbed(modChannel.id, [embed]);
                }
                catch (err) {
                    bot.logger.error(`Event: '${this.conf.name}' has error: ${err.message}.`);
                }
            }
        });
    }
}
module.exports = InviteDelete;
