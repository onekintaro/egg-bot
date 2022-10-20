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
const { Embed } = require('../../utils'), Event = require('../../structures/Event');
/**
 * Message reaction remove event
 * @event Egglord#MessageReactionRemove
 * @extends {Event}
*/
class MessageReactionRemove extends Event {
    constructor(...args) {
        super(...args, {
            dirname: __dirname,
        });
    }
    /**
     * Function for receiving event.
     * @param {bot} bot The instantiating client
     * @param {MessageReaction} reaction The reaction object
     * @param {User} user The user that removed the reaction
     * @readonly
    */
    run(bot, reaction, user) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            // For debugging
            if (bot.config.debug)
                bot.logger.debug(`Message reaction removed${!reaction.message.guild ? '' : ` in guild: ${reaction.message.guild.id}`}`);
            // Make sure it's not a BOT and in a guild
            if (user.bot || !reaction.message.guild)
                return;
            // If reaction needs to be fetched
            try {
                if (reaction.partial)
                    yield reaction.fetch();
                if (reaction.message.partial)
                    yield reaction.message.fetch();
            }
            catch (err) {
                return bot.logger.error(`Event: '${this.conf.name}' has error: ${err.message}.`);
            }
            // make sure the message author isn't the bot
            if (reaction.message.author.id == bot.user.id)
                return;
            // Get server settings / if no settings then return
            const settings = reaction.message.guild.settings;
            if (Object.keys(settings).length == 0)
                return;
            // Check if event messageReactionRemove is for logging
            if (((_a = settings.ModLogEvents) === null || _a === void 0 ? void 0 : _a.includes('MESSAGEREACTIONREMOVE')) && settings.ModLog) {
                const embed = new Embed(bot, reaction.message.guild)
                    .setDescription(`**${user.toString()} unreacted with ${reaction.emoji.toString()} to [this message](${reaction.message.url})** `)
                    .setColor(15158332)
                    .setFooter({ text: `User: ${user.id} | Message: ${reaction.message.id} ` })
                    .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
                    .setTimestamp();
                // Find channel and send message
                try {
                    const modChannel = yield bot.channels.fetch(settings.ModLogChannel).catch(() => bot.logger.error(`Error fetching guild: ${reaction.message.guild.id} logging channel`));
                    if (modChannel && modChannel.guild.id == reaction.message.guild.id)
                        bot.addEmbed(modChannel.id, [embed]);
                }
                catch (err) {
                    bot.logger.error(`Event: '${this.conf.name}' has error: ${err.message}.`);
                }
            }
        });
    }
}
module.exports = MessageReactionRemove;
