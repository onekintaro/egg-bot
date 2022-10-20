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
 * Emoji-list command
 * @extends {Command}
*/
class EmojiList extends Command {
    /**
   * @param {Client} client The instantiating client
   * @param {CommandData} data The data for the command
  */
    constructor(bot) {
        super(bot, {
            name: 'emoji-list',
            guildOnly: true,
            dirname: __dirname,
            aliases: ['emojilist', 'emotes'],
            botPermissions: [Flags.SendMessages, Flags.EmbedLinks],
            description: 'Displays the server\'s emojis',
            usage: 'emojilist',
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
            const emojiList = message.translate('guild/emoji-list:MESSAGE', { GUILD: message.guild.name, EMOJIS: message.guild.emojis.cache.map(e => e.toString()).join(' ') });
            message.channel.send({ content: emojiList });
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
            const emojiList = guild.translate('guild/emoji-list:MESSAGE', { GUILD: guild.name, EMOJIS: guild.emojis.cache.map(e => e.toString()).join(' ') });
            interaction.reply({ content: emojiList });
        });
    }
}
module.exports = EmojiList;
