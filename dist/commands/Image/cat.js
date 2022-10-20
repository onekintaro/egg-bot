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
const { Embed } = require('../../utils'), fetch = require('node-fetch'), { PermissionsBitField: { Flags } } = require('discord.js'), Command = require('../../structures/Command.js');
/**
 * Cat command
 * @extends {Command}
*/
class Cat extends Command {
    /**
     * @param {Client} client The instantiating client
     * @param {CommandData} data The data for the command
    */
    constructor(bot) {
        super(bot, {
            name: 'cat',
            dirname: __dirname,
            aliases: ['meow'],
            botPermissions: [Flags.SendMessages, Flags.EmbedLinks],
            description: 'Have a nice picture of a cat.',
            usage: 'cat',
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
            const msg = yield message.channel.send(message.translate('misc:FETCHING', {
                EMOJI: message.channel.checkPerm('USE_EXTERNAL_EMOJIS') ? bot.customEmojis['loading'] : '', ITEM: this.help.name
            }));
            const res = yield fetch('https://nekos.life/api/v2/img/meow')
                .then(info => info.json())
                .catch(err => {
                // An error occured when looking for image
                if (message.deletable)
                    message.delete();
                bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
                msg.delete();
                return message.channel.error('misc:ERROR_MESSAGE', { ERROR: err.message });
            });
            msg.delete();
            // send image
            const embed = new Embed(bot, message.guild)
                .setColor(3426654)
                .setImage(res.url);
            message.channel.send({ embeds: [embed] });
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
            yield interaction.reply({ content: guild.translate('misc:GENERATING_IMAGE', {
                    EMOJI: bot.customEmojis['loading']
                }) });
            try {
                const res = yield fetch('https://nekos.life/api/v2/img/meow').then(info => info.json());
                // send image
                const embed = new Embed(bot, guild)
                    .setColor(3426654)
                    .setImage(res.url);
                interaction.editReply({ content: ' ', embeds: [embed] });
            }
            catch (err) {
                bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
                return interaction.editReply({ embeds: [channel.error('misc:ERROR_MESSAGE', { ERROR: err.message }, true)], ephemeral: true });
            }
        });
    }
}
module.exports = Cat;
