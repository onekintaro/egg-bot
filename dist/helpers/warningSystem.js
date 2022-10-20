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
const { WarningSchema, timeEventSchema } = require('../database/models'), { time: { getTotalTime }, Embed } = require('../utils');
module.exports.run = (bot, userInput, member, reason) => __awaiter(void 0, void 0, void 0, function* () {
    const { guild } = userInput;
    // retrieve user data in warning database
    try {
        const warnings = WarningSchema.find({
            userID: member.user.id,
            guildID: userInput.guild.id,
        });
        // This is their first warning
        let newWarn;
        if (!warnings[0]) {
            // debugging mode
            if (bot.config.debug)
                bot.logger.debug(`${member.user.tag} was warned for the first time in guild: ${userInput.guild.id}`);
            try {
                // create a new warning file
                newWarn = new WarningSchema({
                    userID: member.user.id,
                    guildID: guild.id,
                    Reason: reason,
                    Moderater: (userInput.member.id == member.user.id) ? bot.user.id : userInput.member.id,
                    IssueDate: new Date().toUTCString(),
                });
                // save and send response to moderator
                yield newWarn.save();
                const embed1 = new Embed(bot, userInput.guild)
                    .setColor(15158332)
                    .setAuthor({ name: guild.translate('moderation/warn:SUCCESS', { USER: member.user.tag }), iconURL: member.user.displayAvatarURL() })
                    .setDescription(guild.translate('moderation/warn:REASON', { REASON: reason }));
                // try and send warning embed to culprit
                const embed2 = new Embed(bot, guild)
                    .setTitle('moderation/warn:TITLE')
                    .setColor(15158332)
                    .setThumbnail(guild.iconURL())
                    .setDescription(guild.translate('moderation/warn:WARN_IN', { NAME: guild.name }))
                    .addFields({ name: guild.translate('moderation/warn:WARN_BY'), value: userInput.member.user.tag, inline: true }, { name: guild.translate('misc:REASON'), value: reason, inline: true }, { name: guild.translate('moderation/warn:WARN_CNTR'), value: '1/3', inline: true });
                // eslint-disable-next-line no-empty-function
                member.send({ embeds: [embed2] }).catch(() => { });
                // Check if the warning was only temporary
                checkTimedWarning(bot, reason, member, userInput, newWarn);
                return embed1;
            }
            catch (err) {
                bot.logger.error(`${err.message} when running command: warnings.`);
                return { error: ['misc:ERROR_MESSAGE', { ERROR: err.message }] };
            }
        }
        else {
            // This is NOT their first warning
            newWarn = new WarningSchema({
                userID: member.user.id,
                guildID: guild.id,
                Reason: reason,
                Moderater: (userInput.member.id == member.user.id) ? bot.user.id : userInput.member.id,
                IssueDate: new Date().toUTCString(),
            });
            // save and send response to moderator
            yield newWarn.save();
            // mute user
            if (warnings.length == 1) {
                // Mutes user for 5 minutes
                yield member.timeout(127000, 'Got a warning');
                // send embed
                const embed1 = new Embed(bot, guild)
                    .setColor(15158332)
                    .setAuthor({ name: guild.translate('moderation/warn:SUCCESS', { USER: member.user.tag }), iconURL: member.user.displayAvatarURL() })
                    .setDescription(guild.translate('moderation/warn:REASON', { REASON: reason }));
                if (bot.config.debug)
                    bot.logger.debug(`${member.user.tag} was warned for the second time in guild: ${guild.id}`);
                // try and send warning embed to culprit
                const embed2 = new Embed(bot, guild)
                    .setTitle('moderation/warn:TITLE')
                    .setColor(15158332)
                    .setThumbnail(guild.iconURL())
                    .setDescription(guild.translate('moderation/warn:WARN_IN', { NAME: guild.name }))
                    .addFields({ name: guild.translate('moderation/warn:WARN_BY'), value: userInput.member.user.tag, inline: true }, { name: guild.translate('misc:REASON'), value: reason, inline: true }, { name: guild.translate('moderation/warn:WARN_CNTR'), value: '2/3', inline: true });
                // eslint-disable-next-line no-empty-function
                member.send({ embeds: [embed2] }).catch(() => { });
                // Check if the warning was only temporary
                checkTimedWarning(bot, reason, member, userInput, newWarn);
                return embed1;
            }
            else {
                if (bot.config.debug)
                    bot.logger.debug(`${member.user.tag} was warned for the third time in guild: ${guild.id}`);
                // try and kick user from guild
                try {
                    yield guild.members.cache.get(member.user.id).kick(reason);
                    yield WarningSchema.collection.deleteOne({ userID: member.user.id, guildID: guild.id });
                    return { success: ['moderation/warn:KICKED', { USER: member.user.tag }] };
                    // Delete user from database
                }
                catch (err) {
                    bot.logger.error(`${err.message} when kicking user.`);
                    return { error: ['misc:ERROR_MESSAGE', { ERROR: err.message }] };
                }
            }
        }
    }
    catch (err) {
        bot.logger.error(`Command: 'warn' has error: ${err.message}.`);
        return { error: ['misc:ERROR_MESSAGE', { ERROR: err.message }] };
    }
});
function checkTimedWarning(bot, reason, member, userInput, newWarn) {
    return __awaiter(this, void 0, void 0, function* () {
        const { guild, channel } = userInput;
        // check if warning is timed
        const possibleTime = reason.split(' ')[0];
        if (possibleTime.endsWith('d') || possibleTime.endsWith('h') || possibleTime.endsWith('m') || possibleTime.endsWith('s')) {
            const time = getTotalTime(possibleTime);
            if (!time)
                return;
            // connect to database
            const newEvent = new timeEventSchema({
                userID: member.user.id,
                guildID: guild.id,
                time: new Date(new Date().getTime() + time),
                channelID: channel.id,
                type: 'warn',
            });
            yield newEvent.save();
            // delete warning from user
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                // Delete item from database as bot didn't crash
                yield WarningSchema.findByIdAndRemove(newWarn._id);
                yield timeEventSchema.findByIdAndRemove(newEvent._id);
            }), time);
        }
        // If logging is enabled send warning/kick embed to lodding channel
        yield bot.emit('warning', member, newWarn);
    });
}
