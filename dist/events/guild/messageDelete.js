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
const { Embed } = require('../../utils'), { ReactionRoleSchema, GiveawaySchema } = require('../../database/models'), Event = require('../../structures/Event');
/**
 * Message delete event
 * @event Egglord#MessageDelete
 * @extends {Event}
*/
class MessageDelete extends Event {
    constructor(...args) {
        super(...args, {
            dirname: __dirname,
        });
    }
    /**
     * Function for receiving event.
     * @param {bot} bot The instantiating client
     * @param {Message} message The deleted message
     * @readonly
    */
    run(bot, message) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            // For debugging
            if (bot.config.debug)
                bot.logger.debug(`Message has been deleted${!message.guild ? '' : ` in guild: ${message.guild.id}`}.`);
            // Make sure the message wasn't deleted in a Dm channel
            if (message.channel.type == 'dm')
                return;
            // If someone leaves the server and the server has default discord messages, it gets removed but says message content is null (Don't know why)
            if (!message.content && message.attachments.size == 0 && message.embeds[0])
                return;
            // if the message is a partial or a webhook return
            if (message.partial || message.webhookID)
                return;
            // Check if the message was a giveaway/reaction role embed
            try {
                // check reaction roles
                const rr = yield ReactionRoleSchema.findOneAndRemove({ messageID: message.id, channelID: message.channel.id });
                if (rr)
                    bot.logger.log('A reaction role embed was deleted.');
                // check giveaways
                const g = yield GiveawaySchema.findOneAndRemove({ messageID: message.id, channelID: message.channel.id });
                if (g) {
                    yield bot.giveawaysManager.delete(message.id);
                    bot.logger.log('A giveaway embed was deleted.');
                }
            }
            catch (err) {
                bot.logger.error(`Event: '${this.conf.name}' has error: ${err.message}.`);
            }
            // Make sure its not the bot
            if (message.author.id == bot.user.id)
                return;
            // Get server settings / if no settings then return
            const settings = (_b = (_a = message.guild) === null || _a === void 0 ? void 0 : _a.settings) !== null && _b !== void 0 ? _b : [];
            if (Object.keys(settings).length == 0)
                return;
            // Check if ModLog plugin is active
            if (message.content.startsWith(settings.prefix))
                return;
            // Check if event messageDelete is for logging
            if (((_c = settings.ModLogEvents) === null || _c === void 0 ? void 0 : _c.includes('MESSAGEDELETE')) && settings.ModLog) {
                // shorten message if it's longer then 1024
                let shortened = false;
                let content = message.content;
                if (content.length > 1024) {
                    content = content.slice(0, 1020) + '...';
                    shortened = true;
                }
                // Basic message construct
                const embed = new Embed(bot, message.guild)
                    .setDescription(`**Message from ${message.author.toString()} deleted in ${message.channel.toString()}**`)
                    .setColor(15158332)
                    .setFooter({ text: `Author: ${message.author.id} | Message: ${message.id}` })
                    .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() });
                if (message.content.length > 0)
                    embed.addFields({ name: `Content ${shortened ? ' (shortened)' : ''}:`, value: `${content}` });
                embed.setTimestamp();
                // check for attachment deletion
                if (message.attachments.size > 0) {
                    embed.addFields({
                        'name': 'Attachments:',
                        'value': message.attachments.map(file => file.url).join('\n'),
                    });
                }
                // Find channel and send message
                try {
                    const modChannel = yield bot.channels.fetch(settings.ModLogChannel).catch(() => bot.logger.error(`Error fetching guild: ${message.guild.id} logging channel`));
                    if (modChannel && modChannel.guild.id == message.guild.id)
                        bot.addEmbed(modChannel.id, [embed]);
                }
                catch (err) {
                    bot.logger.error(`Event: '${this.conf.name}' has error: ${err.message}.`);
                }
            }
        });
    }
}
module.exports = MessageDelete;
