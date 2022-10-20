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
const { GiveawaySchema, RankSchema, WarningSchema, ReactionRoleSchema } = require('../../database/models'), { ActivityType, EmbedBuilder, AttachmentBuilder } = require('discord.js'), { Canvas } = require('canvacord'), Event = require('../../structures/Event');
/**
 * Guild delete event
 * @event Egglord#GuildDelete
 * @extends {Event}
*/
class GuildDelete extends Event {
    constructor(...args) {
        super(...args, {
            dirname: __dirname,
        });
    }
    /**
     * Function for receiving event.
     * @param {bot} bot The instantiating client
     * @param {Guild} guild The guild that kicked the bot
     * @readonly
    */
    run(bot, guild) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            if (!bot.isReady() && !guild.available)
                return;
            bot.logger.log(`[GUILD LEAVE] ${guild.name} (${guild.id}) removed the bot.`);
            yield bot.DeleteGuild(guild);
            // Send message to channel that bot has left a server
            let attachment;
            try {
                const embed = new EmbedBuilder()
                    .setTitle(`[GUILD LEAVE] ${guild.name}`);
                if (guild.icon == null) {
                    const icon = yield Canvas.guildIcon((_a = guild.name) !== null && _a !== void 0 ? _a : 'undefined', 128);
                    attachment = new AttachmentBuilder(icon, { name: 'guildicon.png' });
                    embed.setImage('attachment://guildicon.png');
                }
                else {
                    embed.setImage(guild.iconURL({ dynamic: true, size: 1024 }));
                }
                embed.setDescription([
                    `Guild ID: ${(_b = guild.id) !== null && _b !== void 0 ? _b : 'undefined'}`,
                    `Owner: ${(_c = bot.users.cache.get(guild.ownerId)) === null || _c === void 0 ? void 0 : _c.tag}`,
                    `MemberCount: ${(_d = guild === null || guild === void 0 ? void 0 : guild.memberCount) !== null && _d !== void 0 ? _d : 'undefined'}`,
                ].join('\n'));
                const modChannel = yield bot.channels.fetch(bot.config.SupportServer.GuildChannel).catch(() => bot.logger.error(`Error fetching guild: ${guild.id} logging channel`));
                if (modChannel)
                    bot.addEmbed(modChannel.id, [embed, attachment]);
            }
            catch (err) {
                bot.logger.error(`Event: '${this.conf.name}' has error: ${err.message}.`);
            }
            // Clean up database (delete all guild data)
            // Delete ranks from database
            try {
                const r = yield RankSchema.deleteMany({
                    guildID: guild.id,
                });
                if (r.deletedCount >= 1)
                    bot.logger.log(`Deleted ${r.deletedCount} ranks.`);
            }
            catch (err) {
                bot.logger.error(`Failed to delete Ranked data, error: ${err.message}`);
            }
            // Delete giveaways from database
            try {
                const g = yield GiveawaySchema.deleteMany({
                    guildID: guild.id,
                });
                if (g.deletedCount >= 1)
                    bot.logger.log(`Deleted ${g.deletedCount} giveaways.`);
            }
            catch (err) {
                bot.logger.error(`Failed to delete Giveaway data, error: ${err.message}`);
            }
            // Delete warnings from database
            try {
                const w = yield WarningSchema.deleteMany({
                    guildID: guild.id,
                });
                if (w.deletedCount >= 1)
                    bot.logger.log(`Deleted ${w.deletedCount} warnings.`);
            }
            catch (err) {
                bot.logger.error(`Failed to delete Warning data, error: ${err.message}`);
            }
            // Delete reaction roles from database
            try {
                const rr = yield ReactionRoleSchema.deleteMany({
                    guildID: guild.id,
                });
                if (rr.deletedCount >= 1)
                    bot.logger.log(`Deleted ${rr.deletedCount} reaction roles.`);
            }
            catch (err) {
                bot.logger.error(`Failed to delete Warning data, error: ${err.message}`);
            }
            // update bot's activity
            bot.SetActivity(ActivityType.Watching, [`${bot.guilds.cache.size} servers!`, `${bot.users.cache.size} users!`]);
        });
    }
}
module.exports = GuildDelete;
