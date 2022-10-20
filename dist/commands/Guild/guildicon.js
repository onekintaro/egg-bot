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
const { Embed } = require('../../utils'), { PermissionsBitField: { Flags } } = require('discord.js'), Command = require('../../structures/Command.js');
/**
 * Guildicon command
 * @extends {Command}
*/
class Guildicon extends Command {
    /**
   * @param {Client} client The instantiating client
   * @param {CommandData} data The data for the command
  */
    constructor(bot) {
        super(bot, {
            name: 'guildicon',
            guildOnly: true,
            dirname: __dirname,
            aliases: ['servericon'],
            botPermissions: [Flags.SendMessages, Flags.EmbedLinks],
            description: 'Get the server\'s icon.',
            usage: 'guildicon',
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
            // Check for guild icon & send message
            if (message.guild.icon) {
                const embed = new Embed(bot, message.guild)
                    .setDescription(message.translate('guild/guildicon:ICON', { URL: message.guild.iconURL({ dynamic: true, size: 1024 }) }))
                    .setImage(message.guild.iconURL({ dynamic: true, size: 1024 }));
                message.channel.send({ embeds: [embed] });
            }
            else {
                if (message.deletable)
                    message.delete();
                message.channel.error('guild/guildicon:NO_GUILD_ICON');
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
            // Check for guild icon & send message
            if (guild.icon) {
                const embed = new Embed(bot, guild)
                    .setDescription(guild.translate('guild/guildicon:ICON', { URL: guild.iconURL({ dynamic: true, size: 1024 }) }))
                    .setImage(guild.iconURL({ dynamic: true, size: 1024 }));
                interaction.reply({ embeds: [embed] });
            }
            else {
                interaction.reply({ embeds: [channel.error('guild/guildicon:NO_GUILD_ICON', {}, true)], ephemeral: true });
            }
        });
    }
}
module.exports = Guildicon;
