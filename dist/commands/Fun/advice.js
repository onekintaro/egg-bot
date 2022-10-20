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
const fetch = require('node-fetch'), { EmbedBuilder, PermissionsBitField: { Flags } } = require('discord.js'), Command = require('../../structures/Command.js');
/**
 * Advice command
 * @extends {Command}
*/
class Advice extends Command {
    /**
   * @param {Client} client The instantiating client
   * @param {CommandData} data The data for the command
  */
    constructor(bot) {
        super(bot, {
            name: 'advice',
            dirname: __dirname,
            botPermissions: [Flags.SendMessages, Flags.EmbedLinks],
            description: 'Get some random advice',
            usage: 'advice',
            cooldown: 1000,
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
            const msg = yield message.channel.send(message.translate('misc:FETCHING', {
                EMOJI: message.channel.checkPerm('USE_EXTERNAL_EMOJIS') ? bot.customEmojis['loading'] : '', ITEM: this.help.name
            }));
            // Connect to API and fetch data
            try {
                const data = yield fetch('https://api.adviceslip.com/advice').then(res => res.json());
                msg.delete();
                const embed = new EmbedBuilder()
                    .setDescription(`💡 ${data.slip.advice}`);
                message.channel.send({ embeds: [embed] });
            }
            catch (err) {
                if (message.deletable)
                    message.delete();
                bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
                msg.delete();
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
            try {
                const data = yield fetch('https://api.adviceslip.com/advice').then(res => res.json());
                interaction.reply({ embeds: [{ color: 'RANDOM', description: `💡 ${data.slip.advice}` }] });
            }
            catch (err) {
                bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
                interaction.reply({ embeds: [channel.error('misc:ERROR_MESSAGE', { ERROR: err.message }, true)], ephemeral: true });
            }
        });
    }
}
module.exports = Advice;
