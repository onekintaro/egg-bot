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
const { RankSchema } = require('../database/models'), varSetter = require('./variableSetter'), levelcd = new Set();
class LevelManager {
    constructor(bot, message) {
        this.bot = bot;
        this.message = message;
    }
    check() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { channel, member, guild, guild: { settings } } = this.message;
            // Check if this was triggered by an ignored channel
            if ((_a = settings.LevelIgnoreChannel) === null || _a === void 0 ? void 0 : _a.includes(channel.id))
                return;
            const roles = member.roles.cache.map(r => r.id);
            if (roles.some(r => { var _a; return (_a = settings.LevelIgnoreRoles) === null || _a === void 0 ? void 0 : _a.includes(r); }))
                return;
            // Add a cooldown so people can't spam levels
            if (!levelcd.has(member.id)) {
                // calculate xp added
                const xpAdd = Math.round((Math.floor(Math.random() * 7) + 8) * settings.LevelMultiplier);
                // find user
                try {
                    const res = yield RankSchema.findOne({ userID: member.id, guildID: guild.id });
                    // no account was found (this is user's first message with level plugin on)
                    if (!res) {
                        const newXp = new RankSchema({
                            userID: member.id,
                            guildID: guild.id,
                            Xp: xpAdd,
                            Level: 1,
                        });
                        yield this._database(newXp);
                    }
                    else {
                        // user was found
                        res.Xp = res.Xp + xpAdd;
                        const xpNeed = (5 * (res.Level ** 2) + 50 * res.Level + 100);
                        // User has leveled up
                        if (res.Xp >= xpNeed) {
                            // now check how to send message
                            res.Level = res.Level + 1;
                            if (settings.LevelOption == 1) {
                                channel.send(varSetter(settings.LevelMessage, member, channel, member.guild).replace('{level}', res.Level));
                            }
                            else if (settings.LevelOption == 2) {
                                const lvlChannel = guild.channels.cache.get(settings.LevelChannel);
                                if (lvlChannel)
                                    lvlChannel.send(settings.LevelMessage.replace('{user}', this.message.author).replace('{level}', res.Level));
                            }
                            if (this.bot.config.debug)
                                this.bot.logger.debug(`${this.message.author.tag} has leveled up to ${res.Level} in guild: ${guild.id}.`);
                        }
                        // update database
                        yield this._database(res);
                        this.UpdateCooldown(member.id);
                    }
                }
                catch (err) {
                    console.log(err);
                    this.bot.logger.error(err.message);
                }
            }
        });
    }
    _database(doc) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                doc.save()
                    .then(() => {
                    const res = this.message.guild.levels.find(({ userID }) => userID == this.message.author.id);
                    if (res) {
                        res.Xp = doc.Xp;
                        res.Level = doc.Level;
                    }
                    else {
                        this.message.guild.levels.push({ userID: this.message.author.id, guildID: this.message.guild.id, Xp: doc.Xp, Level: 1 });
                    }
                });
            }
            catch (err) {
                this.bot.logger.error(err.message);
            }
        });
    }
    UpdateCooldown(ID) {
        // add user to cooldown (1 minute cooldown)
        levelcd.add(ID);
        setTimeout(() => {
            levelcd.delete(ID);
        }, 60000);
    }
}
module.exports = LevelManager;
