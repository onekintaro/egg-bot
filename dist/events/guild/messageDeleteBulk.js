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
const dateFormat = require('dateformat'), { AttachmentBuilder } = require('discord.js'), { Embed } = require('../../utils'), Event = require('../../structures/Event');
/**
 * Message delete bulk event
 * @event Egglord#MessageDeleteBulk
 * @extends {Event}
*/
class MessageDeleteBulk extends Event {
    constructor(...args) {
        super(...args, {
            dirname: __dirname,
        });
    }
    /**
     * Function for receiving event.
     * @param {bot} bot The instantiating client
     * @param {Collection<Snowflake, Message>} message The deleted message
     * @readonly
    */
    run(bot, messages) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            // For debugging
            if (bot.config.debug)
                bot.logger.debug(`${messages.size} messages have been deleted in guild: ${messages.first().guild.id}`);
            // Get server settings / if no settings then return
            const settings = messages.first().channel.guild.settings;
            if (Object.keys(settings).length == 0)
                return;
            // Check if event messageDeleteBulk is for logging
            if (((_a = settings.ModLogEvents) === null || _a === void 0 ? void 0 : _a.includes('MESSAGEDELETEBULK')) && settings.ModLog) {
                // Create file of deleted messages
                let humanLog = `**Deleted Messages from #${messages.first().channel.name} (${messages.first().channel.id}) in ${messages.first().guild.name} (${messages.first().guild.id})**`;
                for (const message of [...messages.values()].reverse()) {
                    humanLog += `\r\n\r\n[${dateFormat(message.createdAt, 'ddd dd/mm/yyyy HH:MM:ss')}] ${(_c = (_b = message.author) === null || _b === void 0 ? void 0 : _b.tag) !== null && _c !== void 0 ? _c : 'Unknown'} (${message.id})`;
                    humanLog += ' : ' + message.content;
                }
                const attachment = new AttachmentBuilder(Buffer.from(humanLog, 'utf-8'), { name: 'DeletedMessages.txt' });
                // Get modlog channel
                const modChannel = messages.first().guild.channels.cache.get(settings.ModLogChannel);
                if (modChannel) {
                    const msg = yield modChannel.send({ files: [attachment] });
                    // embed
                    const embed = new Embed(bot, messages.first().guild.id)
                        .setDescription(`**Bulk deleted messages in ${messages.first().channel.toString()}**`)
                        .setColor(15158332)
                        .setFooter({ text: `Channel: ${messages.first().channel.id}` })
                        .setAuthor({ name: messages.first().channel.name, iconURL: messages.first().guild.iconURL })
                        .addFields({ name: 'Message count:', value: `${messages.size}`, inline: true }, { name: 'Deleted Messages:', value: `[view](https://txt.discord.website/?txt=${modChannel.id}/${msg.attachments.first().id}/DeletedMessages)`, inline: true })
                        .setTimestamp();
                    bot.addEmbed(modChannel.id, [embed]);
                }
            }
        });
    }
}
module.exports = MessageDeleteBulk;
