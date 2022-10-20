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
const { EmbedBuilder } = require('discord.js'), { WarningSchema } = require('../../database/models'), Event = require('../../structures/Event');
/**
 * Warning event
 * @event Egglord#Warning
 * @extends {Event}
*/
class Warning extends Event {
    constructor(...args) {
        super(...args, {
            dirname: __dirname,
        });
    }
    /**
     * Function for receiving event.
     * @param {bot} bot The instantiating client
     * @param {GuildMember} member The member that was warned
     * @param {WarningSchema} warning The warning
     * @readonly
    */
    run(bot, member, warning) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            // get settings
            const settings = member.guild.settings;
            if (Object.keys(settings).length == 0)
                return;
            // fetch latest warning to get information
            if (((_a = settings.ModLogEvents) === null || _a === void 0 ? void 0 : _a.includes('WARNING')) && settings.ModLog) {
                const warns = yield WarningSchema.find({
                    userID: member.user.id,
                    guildID: member.guild.id,
                });
                // For debugging
                const embed = new EmbedBuilder()
                    .setColor(15158332)
                    .setAuthor({ name: `${warns.length == 3 ? '[KICK]' : '[WARN]'}`, iconURL: member.user.displayAvatarURL() })
                    .addFields({ name: 'User', value: member.toString(), inline: true }, { name: 'Moderator', value: `${member.guild.members.cache.get(warning.Moderater).user.tag}`, inline: true }, { name: 'Warnings', value: `${warns.length != 3 ? warns.length : '1'}`, inline: true }, { name: 'Reason:', value: warning.reason })
                    .setTimestamp();
                // Find channel and send message
                try {
                    const modChannel = yield bot.channels.fetch(settings.ModLogChannel).catch(() => bot.logger.error(`Error fetching guild: ${member.guild.id} logging channel`));
                    if (modChannel && modChannel.guild.id == member.guild.id)
                        bot.addEmbed(modChannel.id, [embed]);
                }
                catch (err) {
                    bot.logger.error(`Event: '${this.conf.name}' has error: ${err.message}.`);
                }
            }
        });
    }
}
module.exports = Warning;
