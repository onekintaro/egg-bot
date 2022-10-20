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
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField: { Flags } } = require('discord.js'), Command = require('../../structures/Command.js');
/**
 * Dashboard command
 * @extends {Command}
*/
class Dashboard extends Command {
    /**
   * @param {Client} client The instantiating client
   * @param {CommandData} data The data for the command
  */
    constructor(bot) {
        super(bot, {
            name: 'dashboard',
            guildOnly: true,
            dirname: __dirname,
            aliases: ['db'],
            botPermissions: [Flags.SendMessages, Flags.EmbedLinks],
            description: 'Sends a link to your Server\'s dashboard.',
            usage: 'dashboard',
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
            const row = new ActionRowBuilder()
                .addComponents(new ButtonBuilder()
                .setLabel('Access the dashboard')
                .setStyle(ButtonStyle.Link)
                .setURL(`${bot.config.websiteURL}/dashboard/${message.guild.id}`));
            message.channel.send({ content: 'There you go.', components: [row] });
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
            const row = new ActionRowBuilder()
                .addComponents(new ButtonBuilder()
                .setLabel('Access the dashboard')
                .setStyle(ButtonStyle.Link)
                .setURL(`${bot.config.websiteURL}/dashboard/${guild.id}`));
            interaction.reply({ content: 'There you go.', components: [row] });
        });
    }
}
module.exports = Dashboard;
