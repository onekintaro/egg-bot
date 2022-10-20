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
const { GuildSchema, userSchema, TagsSchema } = require('../../database/models'), Event = require('../../structures/Event');
/**
 * Ready event
 * @event Egglord#Ready
 * @extends {Event}
*/
class Ready extends Event {
    constructor(...args) {
        super(...args, {
            dirname: __dirname,
            once: true,
        });
    }
    /**
     * Function for receiving event.
     * @param {bot} bot The instantiating client
     * @readonly
    */
    run(bot) {
        return __awaiter(this, void 0, void 0, function* () {
            // Load up audio player
            // try {
            // 	bot.manager.init(bot.user.id);
            // } catch (err) {
            // 	bot.logger.error(`Audio manager failed to load due to error: ${err.message}`);
            // }
            // set up webserver
            try {
                yield require('../../http')(bot);
            }
            catch (err) {
                console.log(err.message);
            }
            // webhook manager (loop every 10secs)
            setInterval(() => __awaiter(this, void 0, void 0, function* () {
                yield require('../../helpers/webhookManager')(bot);
            }), 10000);
            for (const guild of [...bot.guilds.cache.values()]) {
                // Sort out guild settings
                yield guild.fetchSettings();
                if (guild.settings == null)
                    return bot.emit('guildCreate', guild);
                if (guild.settings.plugins.includes('Level'))
                    yield guild.fetchLevels();
                // Append tags to guild specific arrays
                if (guild.settings.PrefixTags) {
                    TagsSchema.find({ guildID: guild.id }).then(result => {
                        result.forEach(value => {
                            guild.guildTags.push(value.name);
                        });
                    });
                }
            }
            // Delete server settings on servers that removed the bot while it was offline
            const data = yield GuildSchema.find({});
            if (data.length > bot.guilds.cache.size) {
                // A server kicked the bot when it was offline
                const guildCount = [];
                // Get bot guild ID's
                for (let i = 0; i < bot.guilds.cache.size; i++) {
                    guildCount.push([...bot.guilds.cache.values()][i].id);
                }
                // Now check database for bot guild ID's
                for (const guild of data) {
                    if (!guildCount.includes(guild.guildID)) {
                        bot.emit('guildDelete', { id: guild.guildID, name: guild.guildName });
                    }
                }
            }
            bot.logger.ready('All guilds have been initialized.');
            // Every 1 minutes fetch new guild data
            setInterval(() => __awaiter(this, void 0, void 0, function* () {
                if (bot.config.debug)
                    bot.logger.debug('Fetching guild settings (Interval: 1 minutes)');
                bot.guilds.cache.forEach((guild) => __awaiter(this, void 0, void 0, function* () {
                    yield guild.fetchSettings();
                }));
            }), 60000);
            // check for premium users
            const users = yield userSchema.find({});
            for (const { userID, premium, premiumSince, cmdBanned, rankImage } of users) {
                const user = yield bot.users.fetch(userID);
                user.premium = premium;
                user.premiumSince = premiumSince !== null && premiumSince !== void 0 ? premiumSince : 0;
                user.cmdBanned = cmdBanned;
                user.rankImage = rankImage ? Buffer.from(rankImage !== null && rankImage !== void 0 ? rankImage : '', 'base64') : '';
            }
            // enable time event handler (in case of bot restart)
            try {
                yield require('../../helpers/TimedEventsManager')(bot);
            }
            catch (err) {
                console.log(err);
            }
            // LOG ready event
            bot.logger.log('-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=', 'ready');
            bot.logger.log(`${bot.user.tag}, ready to serve [${bot.users.cache.size}] users in [${bot.guilds.cache.size}] servers.`, 'ready');
            bot.logger.log('-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=', 'ready');
        });
    }
}
module.exports = Ready;
