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
const translate = require('@vitalets/google-translate-api'), optiic = new (require('optiic')), { Collection } = require('discord.js'), { ChannelType } = require('discord-api-types/v10'), Event = require('../../structures/Event');
/**
 * click menu event
 * @event Egglord#ClickMenu
 * @extends {Event}
*/
class ClickMenu extends Event {
    constructor(...args) {
        super(...args, {
            dirname: __dirname,
        });
    }
    /**
     * Function for receiving event.
     * @param {bot} bot The instantiating client
     * @param {CommandInteraction} interaction The context menu clicked
     * @readonly
    */
    run(bot, interaction) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const guild = bot.guilds.cache.get(interaction.guildId), channel = bot.channels.cache.get(interaction.channelId);
            // Check to see if user is in 'cooldown'
            if (!bot.cooldowns.has(interaction.commandName)) {
                bot.cooldowns.set(interaction.commandName, new Collection());
            }
            const now = Date.now(), timestamps = bot.cooldowns.get(interaction.commandName), cooldownAmount = (interaction.user.premium ? 2250 : 3000);
            if (timestamps.has(interaction.user.id)) {
                const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
                if (now < expirationTime) {
                    const timeLeft = (expirationTime - now) / 1000;
                    return interaction.reply({ embeds: [channel.error('events/message:COMMAND_COOLDOWN', { NUM: timeLeft.toFixed(1) }, true)], ephemeral: true });
                }
            }
            // Run context menu
            if (bot.config.debug)
                bot.logger.debug(`Context menu: ${interaction.commandName} was ran by ${interaction.user.username}.`);
            setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
            switch (interaction.commandName) {
                case 'Avatar':
                    bot.commands.get('avatar').reply(bot, interaction, channel, interaction.targetId);
                    break;
                case 'Userinfo':
                    if (interaction.commandName == 'Userinfo')
                        bot.commands.get('user-info').reply(bot, interaction, channel, interaction.targetId);
                    break;
                case 'Translate': {
                    // Only allow this to show in server channels
                    if (channel.type == ChannelType.DM)
                        return interaction.reply({ embeds: [channel.error('events/message:GUILD_ONLY', {}, true)], ephemeral: true });
                    // fetch message and check if message has content
                    const message = yield channel.messages.fetch(interaction.targetId);
                    if (!message.content)
                        return interaction.reply({ embeds: [channel.error('events/custom:NO_CONTENT', {}, true)], ephemeral: true });
                    // translate message to server language
                    try {
                        const bar = yield translate(message.content, { to: guild.settings.Language.split('-')[0] });
                        interaction.reply({ content: `Translated to \`${bot.languages.find(lan => lan.name == guild.settings.Language).nativeName}\`: ${bar.text}`,
                            allowedMentions: { parse: [] } });
                    }
                    catch (err) {
                        bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
                        interaction.reply({ embeds: [channel.error('misc:ERROR_MESSAGE', { ERROR: err.message }, true)], ephemeral: true });
                    }
                    break;
                }
                case 'OCR': {
                    // fetch message and check if message has attachments
                    const message = yield channel.messages.fetch(interaction.targetId);
                    if (!((_a = message.attachments.first()) === null || _a === void 0 ? void 0 : _a.url))
                        return interaction.reply({ embeds: [channel.error('events/custom:NO_ATTACH', {}, true)], ephemeral: true });
                    // Get text from image
                    const res = yield optiic.process({
                        image: message.attachments.first().url,
                        mode: 'ocr',
                    });
                    // Make sure text was actually retrieved
                    if (!res.text) {
                        interaction.reply({ embeds: [channel.error('events/custom:NO_TEXT_FROM_ATTACH', {}, true)], ephemeral: true });
                    }
                    else {
                        interaction.reply({ content: `Text from image: ${res.text}` });
                    }
                    break;
                }
                case 'Add to Queue': {
                    // Only allow this to show in server channels
                    if (channel.type == ChannelType.DM)
                        return interaction.reply({ embeds: [channel.error('events/message:GUILD_ONLY', {}, true)], ephemeral: true });
                    const message = yield channel.messages.fetch(interaction.targetId);
                    const args = new Map().set('track', { value: message.content });
                    bot.commands.get('play').callback(bot, interaction, guild, args);
                    break;
                }
                case 'Screenshot': {
                    // fetch message and check if message has content
                    const message = yield channel.messages.fetch(interaction.targetId);
                    if (!message.content)
                        return interaction.reply({ embeds: [channel.error('events/custom:NO_TRANS', {}, true)], ephemeral: true });
                    bot.commands.get('screenshot').reply(bot, interaction, channel, message);
                    break;
                }
                default:
                    interaction.reply({ content: 'Something went wrong' });
            }
            timestamps.set(interaction.user.id, now);
        });
    }
}
module.exports = ClickMenu;
