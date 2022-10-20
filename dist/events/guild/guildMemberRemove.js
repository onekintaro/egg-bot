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
const { Embed } = require('../../utils'), { RankSchema } = require('../../database/models'), dateFormat = require('dateformat'), varSetter = require('../../helpers/variableSetter'), Event = require('../../structures/Event');
/**
 * Guild member remove event
 * @event Egglord#GuildMemberRemove
 * @extends {Event}
*/
class GuildMemberRemove extends Event {
    constructor(...args) {
        super(...args, {
            dirname: __dirname,
        });
    }
    /**
     * Function for receiving event.
     * @param {bot} bot The instantiating client
     * @param {GuildMember} member The member that has left/been kicked from a guild
     * @readonly
    */
    run(bot, member) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            // For debugging
            if (bot.config.debug)
                bot.logger.debug(`Member: ${member.user.tag} has left guild: ${member.guild.id}.`);
            if (member.user.id == bot.user.id)
                return;
            // Get server settings / if no settings then return
            const settings = member.guild.settings;
            if (Object.keys(settings).length == 0)
                return;
            // Check if event guildMemberRemove is for logging
            if (((_a = settings.ModLogEvents) === null || _a === void 0 ? void 0 : _a.includes('GUILDMEMBERREMOVE')) && settings.ModLog) {
                const embed = new Embed(bot, member.guild)
                    .setDescription(`${member.toString()}\nMember count: ${member.guild.memberCount}`)
                    .setColor(15158332)
                    .setFooter({ text: `ID: ${member.id}` })
                    .setThumbnail(member.user.displayAvatarURL())
                    .setAuthor({ name: 'User left:', iconURL: member.user.displayAvatarURL() })
                    .addFields({ name: 'Joined at:', value: member.partial ? 'Unknown' : `${dateFormat(member.joinedAt, 'ddd dd/mm/yyyy')} (${Math.round((new Date() - member.joinedAt) / 86400000)} day(s) ago)` })
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
            // Welcome plugin (give roles and message)
            if (settings.welcomePlugin) {
                const channel = member.guild.channels.cache.get(settings.welcomeMessageChannel);
                if (channel && settings.welcomeGoodbyeToggle)
                    channel.send(varSetter(settings.welcomeGoodbyeText, member, channel, member.guild)).catch(e => bot.logger.error(e.message));
            }
            // Remove member's rank
            try {
                yield RankSchema.findOneAndRemove({ userID: member.user.id, guildID: member.guild.id });
            }
            catch (err) {
                bot.logger.error(`Event: '${this.conf.name}' has error: ${err.message}.`);
            }
        });
    }
}
module.exports = GuildMemberRemove;
