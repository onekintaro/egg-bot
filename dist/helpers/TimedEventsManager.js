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
const { timeEventSchema, WarningSchema } = require('../database/models'), ms = require('ms'), { Embed, time: { getTotalTime } } = require('../utils'), { AttachmentBuilder } = require('discord.js');
module.exports = (bot) => __awaiter(void 0, void 0, void 0, function* () {
    const events = yield timeEventSchema.find({});
    // loop every 3 seconds checking each item
    setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        // make sure there are events
        if (events.length == 0)
            return;
        // check each event
        for (const event of events) {
            // get settings for the guild
            const guild = bot.guilds.cache.get(event.guildID);
            const user = yield bot.users.fetch(event.userID);
            if (new Date() >= new Date(event.time)) {
                switch (event.type) {
                    case 'ban': {
                        bot.logger.debug(`Unbanning ${user.tag} in guild: ${guild.id}.`);
                        // unban user from guild
                        try {
                            const bans = yield guild.bans.fetch();
                            if (bans.size == 0)
                                return;
                            const bUser = bans.get(event.userID);
                            if (!bUser)
                                return;
                            yield guild.members.unban(bUser.user);
                            const channel = bot.channels.cache.get(event.channelID);
                            if (channel)
                                yield channel.success('moderation/unban:SUCCESS', { USER: user }).then(m => m.timedDelete({ timeout: 3000 }));
                        }
                        catch (err) {
                            bot.logger.error(`Error: ${err.message} when trying to unban user. (timed event)`);
                            (_a = bot.channels.cache.get(event.channelID)) === null || _a === void 0 ? void 0 : _a.error('misc:ERROR_MESSAGE', { ERROR: err.message }).then(m => m.timedDelete({ timeout: 5000 }));
                        }
                        break;
                    }
                    case 'reminder': {
                        bot.logger.debug(`Reminding ${bot.users.cache.get(event.userID).tag}`);
                        // Message user about reminder
                        const attachment = new AttachmentBuilder('./src/assets/imgs/Timer.png', { name: 'Timer.png' });
                        const embed = new Embed(bot, guild)
                            .setTitle('fun/reminder:TITLE')
                            .setThumbnail('attachment://Timer.png')
                            .setDescription(`${event.message}\n[${guild.translate('fun/reminder:DESC')}](https://discord.com/channels/${event.guildID}/${event.channelID}})`)
                            .setFooter({ text: guild.translate('fun/reminder:FOOTER', { TIME: ms(event.time, { long: true }) }) });
                        try {
                            yield bot.users.cache.get(event.userID).send({ embeds: [embed], files: [attachment] });
                        }
                        catch (err) {
                            bot.logger.error(`Error: ${err.message} when sending reminder to user. (timed event)`);
                            (_b = bot.channels.cache.get(event.channelID)) === null || _b === void 0 ? void 0 : _b.send(guild.translate('fun/reminder:RESPONSE', { USER: user.id, INFO: event.message }));
                        }
                        break;
                    }
                    case 'warn':
                        // remove warning
                        try {
                            const res = yield WarningSchema.find({ userID: event.userID, guildID: event.guildID });
                            // find the timed warning
                            for (const warn of res) {
                                const possibleTime = warn.Reason.split(' ')[0];
                                if (possibleTime.endsWith('d') || possibleTime.endsWith('h') || possibleTime.endsWith('m') || possibleTime.endsWith('s')) {
                                    const { error, success: time } = getTotalTime(possibleTime);
                                    if (error)
                                        return;
                                    // make sure time is correct
                                    if (time) {
                                        const a = new Date(warn.IssueDate).getTime() + parseInt(time), b = new Date(event.time).getTime();
                                        // Delete warning
                                        if (Math.abs(a, b) <= 4000)
                                            yield WarningSchema.findByIdAndRemove(warn._id);
                                    }
                                }
                            }
                        }
                        catch (err) {
                            bot.logger.error(`Error: ${err.message} fetching warns. (timed events)`);
                            return (_c = bot.channels.cache.get(event.channelID)) === null || _c === void 0 ? void 0 : _c.error('misc:ERROR_MESSAGE', { ERROR: err.message }).then(m => m.timedDelete({ timeout: 5000 }));
                        }
                        break;
                    case 'premium': {
                        // code block
                        break;
                    }
                    default:
                        // code block
                        bot.logger.error(`Invalid event type: ${event.type}.`);
                }
            }
            // delete from 'cache'
            events.splice(events.indexOf(event), 1);
        }
    }), 3000);
});
