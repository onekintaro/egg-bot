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
const { PermissionsBitField: { Flags } } = require('discord.js'), Command = require('../../structures/Command.js');
/**
 * Flip command
 * @extends {Command}
*/
class Flip extends Command {
    /**
     * @param {Client} client The instantiating client
     * @param {CommandData} data The data for the command
    */
    constructor(bot) {
        super(bot, {
            name: 'flip',
            dirname: __dirname,
            botPermissions: [Flags.SendMessages, Flags.EmbedLinks],
            description: 'Flip a coin.',
            usage: 'flip',
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
            const num = Math.round(Math.random()), emoji = message.channel.checkPerm('USE_EXTERNAL_EMOJIS') ? bot.customEmojis[['head', 'tail'][num]] : '', result = message.translate(`fun/flip:${num < 0.5 ? 'HEADS' : 'TAILS'}`);
            // send result
            message.channel.send({ content: `${emoji} ${result}` });
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
            const channel = guild.channels.cache.get(interaction.channelId), num = Math.round(Math.random()), emoji = channel.checkPerm('USE_EXTERNAL_EMOJIS') ? bot.customEmojis[['head', 'tail'][num]] : '', result = guild.translate(`fun/flip:${num < 0.5 ? 'HEADS' : 'TAILS'}`);
            // send result
            return interaction.reply({ content: `${emoji} ${result}` });
        });
    }
}
module.exports = Flip;
