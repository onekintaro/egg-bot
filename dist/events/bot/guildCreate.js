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
const { EmbedBuilder, AttachmentBuilder, ActivityType } = require('discord.js'), { Canvas } = require('canvacord'), Event = require('../../structures/Event');
/**
 * Guild create event
 * @event Egglord#GuildCreate
 * @extends {Event}
*/
class GuildCreate extends Event {
    constructor(...args) {
        super(...args, {
            dirname: __dirname,
        });
    }
    /**
     * Function for receiving event.
     * @param {bot} bot The instantiating client
     * @param {Guild} guild The guild that added the bot
     * @readonly
    */
    run(bot, guild) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            // LOG server Join
            bot.logger.log(`[GUILD JOIN] ${guild.name} (${guild.id}) added the bot.`);
            // Apply server settings
            try {
                // Create guild settings and fetch cache.
                yield guild.fetchSettings();
            }
            catch (err) {
                bot.logger.error(`Event: '${this.conf.name}' has error: ${err.message}.`);
            }
            // Send message to channel that bot has joined a server
            const owner = yield guild.members.fetch(guild.ownerId);
            const embed = new EmbedBuilder()
                .setTitle(`[GUILD JOIN] ${guild.name}`);
            let attachment;
            if (guild.icon == null) {
                const icon = yield Canvas.guildIcon(guild.name, 128);
                attachment = new AttachmentBuilder(icon, { name: 'guildicon.png' });
                embed.setImage('attachment://guildicon.png');
            }
            else {
                embed.setImage(guild.iconURL({ dynamic: true, size: 1024 }));
            }
            embed.setDescription([
                `Guild ID: ${(_a = guild.id) !== null && _a !== void 0 ? _a : 'undefined'}`,
                `Owner: ${owner.user.tag}`,
                `MemberCount: ${(_b = guild.memberCount) !== null && _b !== void 0 ? _b : 'undefined'}`,
            ].join('\n'));
            // Fetch all members in guild
            try {
                yield guild.members.fetch();
            }
            catch (err) {
                bot.logger.error(`Event: '${this.conf.name}' has error: ${err.message}.`);
            }
            // Find channel and send message
            const modChannel = yield bot.channels.fetch(bot.config.SupportServer.GuildChannel).catch(() => bot.logger.error(`Error fetching guild: ${guild.id} logging channel`));
            if (modChannel)
                bot.addEmbed(modChannel.id, [embed, attachment]);
            // update bot's activity
            bot.SetActivity(ActivityType.Watching, [`${bot.guilds.cache.size} servers!`, `${bot.users.cache.size} users!`]);
            // get slash commands for category
            const enabledPlugins = guild.settings.plugins;
            const data = [];
            for (const plugin of enabledPlugins) {
                const g = yield bot.loadInteractionGroup(plugin, guild);
                if (Array.isArray(g))
                    data.push(...g);
            }
            // upload slash commands to guild
            try {
                yield ((_c = bot.guilds.cache.get(guild.id)) === null || _c === void 0 ? void 0 : _c.commands.set(data));
                bot.logger.log('Loaded Interactions for guild: ' + guild.name);
            }
            catch (err) {
                bot.logger.error(`Failed to load interactions for guild: ${guild.id} due to: ${err.message}.`);
            }
        });
    }
}
module.exports = GuildCreate;
