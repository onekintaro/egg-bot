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
 * Support command
 * @extends {Command}
*/
class Support extends Command {
    /**
     * @param {Client} client The instantiating client
     * @param {CommandData} data The data for the command
    */
    constructor(bot) {
        super(bot, {
            name: 'support',
            dirname: __dirname,
            aliases: ['sup'],
            botPermissions: [Flags.SendMessages, Flags.EmbedLinks],
            description: 'Get support on the bot.',
            usage: 'support',
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
            const embed = new Embed(bot, message.guild)
                .setTitle('misc/support:TITLE', { USER: bot.user.username })
                .setDescription(bot.translate('misc/support:DESC', { SUPPORT: bot.config.SupportServer.link, WEBSITE: bot.config.websiteURL }));
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
            const embed = new Embed(bot, guild)
                .setTitle('misc/support:TITLE', { USER: bot.user.username })
                .setDescription(guild.translate('misc/support:DESC', { SUPPORT: bot.config.SupportServer.link, WEBSITE: bot.config.websiteURL }));
            return interaction.reply({ embeds: [embed] });
        });
    }
}
module.exports = Support;
