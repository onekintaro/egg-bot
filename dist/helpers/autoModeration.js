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
/**
 * Auto moderation
*/
class AutoModeration {
    constructor(bot, message) {
        this.bot = bot;
        this.message = message;
    }
    /**
     * Function for checking the message with AutoModeration
     * @returns {void}
    */
    check() {
        return __awaiter(this, void 0, void 0, function* () {
            const { settings: { Auto_Moderation } } = this.message.guild;
            const message = this.message;
            if (!Auto_Moderation)
                return;
            // Make sure it's not a bot
            if (Auto_Moderation.IgnoreBot && message.author.bot)
                return;
            // Get all words in message + author's roles
            const words = message.content.split(/ +/), roles = message.guild.members.cache.get(message.author.id)._roles;
            // Check for Badwords
            if (Auto_Moderation.Badwords.option >= 1) {
                // The type of bad word filter
                let found;
                if (Auto_Moderation.Badwords.filter == 'ExactMatch') {
                    // Exact match bad word detection
                    found = words.some(word => Auto_Moderation.Badwords.list.includes(word));
                    // for debugging what triggered the Auto moderation
                    if (found && this.bot.config.debug)
                        this.bot.logger.debug(`Auto moderation detected: ${words.find(word => Auto_Moderation.Badwords.list.includes(word))} via 'ExactMatch'.`);
                }
                else if (Auto_Moderation.Badwords.filter == 'Regex') {
                    // Regex bad word detection
                    found = words.some(word => {
                        for (const badWord of Auto_Moderation.Badwords.list) {
                            return (word.indexOf(badWord) !== -1) ? true : false;
                        }
                    });
                    // for debugging what triggered the Auto moderation
                    if (found && this.bot.config.debug) {
                        this.bot.logger.debug(`Auto moderation detected: ${words.find(word => {
                            for (const badWord of Auto_Moderation.Badwords.list) {
                                return (word.indexOf(badWord) !== -1) ? true : false;
                            }
                        })} via 'Regex'.`);
                    }
                }
                else {
                    found = words.some(word => {
                        for (const badWord of Auto_Moderation.Badwords.list) {
                            const distance = require('../utils/functions').CalcLevenDist(word, badWord);
                            return (distance <= 2) ? true : false;
                        }
                    });
                    // for debugging what triggered the Auto moderation
                    if (found && this.bot.config.debug) {
                        this.bot.logger.debug(`Auto moderation detected: ${words.find(word => {
                            for (const badWord of Auto_Moderation.Badwords.list) {
                                const distance = require('../utils/functions').CalcLevenDist(word, badWord);
                                return (distance <= 2) ? true : false;
                            }
                        })} via 'levDistance'.`);
                    }
                }
                // Bad word found
                if (found) {
                    console.log('found');
                    if (!Auto_Moderation.Badwords.IgnoreChannel.includes(message.channel.id)) {
                        // message was sent in a channel that isn't ignored
                        console.log('In a protected channel. punish them');
                        if (!Auto_Moderation.Badwords.IgnoreRole.some(role => roles.includes(role))) {
                            // message author should be punished as they don't have a role to bypass automoderation
                            console.log('Punish user as they dont have ignore role');
                            if (Auto_Moderation.Badwords.option == 1)
                                yield this.deleteMessage();
                            if (Auto_Moderation.Badwords.option == 2)
                                yield this.warnMember('Bad word usage.');
                            if (Auto_Moderation.Badwords.option == 3)
                                yield this.warnDelete('Bad word usage.');
                        }
                    }
                    return true;
                }
            }
            // Check for Repeated Text
            // Keep at very bottom
            return false;
        });
    }
    /**
     * Function for deleting offending message
     * @returns {void}
    */
    deleteMessage() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.bot.config.debug)
                this.bot.logger.debug('Deleted message due to auto-moderation.');
            if (this.message.deletable)
                this.message.delete();
        });
    }
    /**
     * Function for warning member who sent offending message
     * @returns {void}
    */
    warnMember(reason) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.bot.config.debug)
                this.bot.logger.debug('Warning member due to auto-moderation.');
            try {
                yield require('./warning-system').run(this.bot, this.message, this.message.member, reason, this.message.guild.settings);
            }
            catch (err) {
                this.bot.logger.error(`${err.message} when trying to warn user`);
                this.message.channel.error(this.message.guild.settings.Language, 'ERROR_MESSAGE', err.message).then(m => m.timedDelete({ timeout: 10000 }));
            }
        });
    }
    /**
     * Function for warning member and deleting message
     * @returns {void}
    */
    warnMemberAndDeleteMessage(reason) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.bot.config.debug)
                this.bot.logger.debug('Warning member and deleting message due to auto-moderation.');
            if (this.message.deletable)
                this.message.delete();
            yield this.warnMember(reason);
        });
    }
}
module.exports = AutoModeration;
