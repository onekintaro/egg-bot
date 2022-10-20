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
const { Embed } = require('../../utils'), dateFormat = require('dateformat'), Event = require('../../structures/Event');
/**
 * Invite create event
 * @event Egglord#InviteCreate
 * @extends {Event}
*/
class InviteCreate extends Event {
    constructor(...args) {
        super(...args, {
            dirname: __dirname,
        });
    }
    /**
     * Function for receiving event.
     * @param {bot} bot The instantiating client
     * @param {Invite} invite The invite that was created
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
            if (((_a = settings.ModLogEvents) === null || _a === void 0 ? void 0 : _a.includes('INVITECREATE')) && settings.ModLog) {
                const embed = new Embed(bot, invite.guild)
                    .setDescription([
                    `Invite created ${invite.channel ? `in channel: ${invite.channel}` : ''}`,
                    `Code: \`${invite.code}\`.`,
                    `Max uses: \`${invite.maxUses}\`.`,
                    `Runs out: \`${invite.maxAge != 0 ? dateFormat(new Date() + invite.maxAge, 'ddd dd/mm/yyyy') : 'never'}\`.`,
                    `Temporary: \`${invite.temporary}\``,
                ].join('\n'))
                    .setColor(3066993)
                    .setFooter({ text: `ID: ${invite.inviter.id}` })
                    .setAuthor({ name: 'Invite created:', iconURL: invite.inviter.displayAvatarURL() })
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
module.exports = InviteCreate;
