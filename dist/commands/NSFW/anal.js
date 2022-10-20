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
const { get } = require('axios'), { Embed } = require('../../utils'), { PermissionsBitField: { Flags } } = require('discord.js'), Command = require('../../structures/Command.js');
/**
 * Anal command
 * @extends {Command}
*/
class Anal extends Command {
    /**
     * @param {Client} client The instantiating client
     * @param {CommandData} data The data for the command
    */
    constructor(bot) {
        super(bot, {
            name: 'anal',
            nsfw: true,
            dirname: __dirname,
            botPermissions: [Flags.SendMessages, Flags.EmbedLinks],
            description: 'Look at NSFW images.',
            usage: 'anal',
            cooldown: 2000,
            slash: true,
        });
    }
    /**
     * Function for receiving message.
     * @param {bot} bot The instantiating client
     * @param {message} message The message that ran the command
     * @readonly
  */
    run(bot, message) {
        return __awaiter(this, void 0, void 0, function* () {
            // send 'waiting' message to show bot has recieved message
            const msg = yield message.channel.send(message.translate('nsfw/4k:FETCHING', {
                EMOJI: message.channel.checkPerm('USE_EXTERNAL_EMOJIS') ? bot.customEmojis['loading'] : '', ITEM: this.help.name
            }));
            try {
                get('https://nekobot.xyz/api/image?type=anal')
                    .then(res => {
                    msg.delete();
                    const embed = new Embed(bot, message.guild)
                        .setImage(res.data.message);
                    message.channel.send({ embeds: [embed] });
                });
            }
            catch (err) {
                if (message.deletable)
                    message.delete();
                msg.delete();
                bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
                message.channel.error('misc:ERROR_MESSAGE', { ERROR: err.message });
            }
        });
    }
    /**
     * Function for receiving interaction.
     * @param {bot} bot The instantiating client
     * @param {interaction} interaction The interaction that ran the command
     * @param {guild} guild The guild the interaction ran in
     * @readonly
    */
    callback(bot, interaction, guild) {
        return __awaiter(this, void 0, void 0, function* () {
            const channel = guild.channels.cache.get(interaction.channelId);
            yield interaction.reply({ content: guild.translate('misc:FETCHING', { EMOJI: bot.customEmojis['loading'], ITEM: 'Image' }) });
            try {
                get('https://nekobot.xyz/api/image?type=anal')
                    .then(res => {
                    const embed = new Embed(bot, guild)
                        .setImage(res.data.message);
                    interaction.editReply({ content: ' ', embeds: [embed], ephemeral: true });
                });
            }
            catch (err) {
                bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
                return interaction.reply({ embeds: [channel.error('misc:ERROR_MESSAGE', { ERROR: err.message }, true)], ephemeral: true });
            }
        });
    }
}
module.exports = Anal;
