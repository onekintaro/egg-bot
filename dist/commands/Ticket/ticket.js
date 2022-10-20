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
const { Embed } = require('../../utils'), { ActionRowBuilder, ApplicationCommandOptionType, ButtonBuilder, ButtonStyle, PermissionsBitField: { Flags } } = require('discord.js'), Command = require('../../structures/Command.js');
/**
 * Ticket command
 * @extends {Command}
*/
class Ticket extends Command {
    /**
     * @param {Client} client The instantiating client
     * @param {CommandData} data The data for the command
    */
    constructor(bot) {
        super(bot, {
            name: 'ticket',
            guildOnly: true,
            dirname: __dirname,
            aliases: ['ticket'],
            userPermissions: [Flags.ManageGuild],
            botPermissions: [Flags.SendMessages, Flags.EmbedLinks, Flags.AddReactions],
            description: 'Information on ticket plugin.',
            usage: 'ticket',
            cooldown: 3000,
            slash: true,
            options: [
                {
                    name: 'reaction',
                    description: 'Create reaction embed',
                    type: ApplicationCommandOptionType.Subcommand,
                },
                ...bot.commands.filter(c => c.help.category == 'Ticket' && c.help.name !== 'ticket').map(c => ({
                    name: c.help.name.replace('ticket-', ''),
                    description: c.help.description,
                    type: ApplicationCommandOptionType.Subcommand,
                    options: c.conf.options,
                })),
            ],
        });
    }
    /**
     * Function for receiving message.
     * @param {bot} bot The instantiating client
     * @param {message} message The message that ran the command
     * @param {settings} settings The settings of the channel the command ran in
     * @readonly
    */
    run(bot, message, settings) {
        return __awaiter(this, void 0, void 0, function* () {
            // Add ticket reaction embed
            if (message.args[0] == 'reaction') {
                yield this.sendReactionEmbed(bot, message.channel);
            }
            else {
                const embed = new Embed(bot, message.guild)
                    .setTitle('ticket/ticket:TITLE')
                    .setDescription([
                    `\`${settings.prefix}t-<open|create> [reason]\` - ${message.translate('ticket/ticket-create:DESCRIPTION')}.`,
                    `\`${settings.prefix}t-close\` - ${message.translate('ticket/ticket-close:DESCRIPTION')} (Support only).`,
                    `\`${settings.prefix}t-setup\` - ${message.translate('ticket/ticket-setup:DESCRIPTION')} (Admin only).`,
                    `\`${settings.prefix}ticket reaction\` - Add reaction ticket embed (Admin only).`,
                ].join('\n'));
                message.channel.send({ embeds: [embed] });
            }
        });
    }
    /**
     * Function for receiving interaction.
     * @param {bot} bot The instantiating client
     * @param {interaction} interaction The interaction that ran the command
     * @param {guild} guild The guild the interaction ran in
     * @param {args} args The options provided in the command, if any
     * @readonly
    */
    callback(bot, interaction, guild, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const option = interaction.options.getSubcommand();
            // Get the user's option and run it
            if (option == 'reaction') {
                yield this.sendReactionEmbed(bot, interaction.channel);
                interaction.reply({ content: 'Created embed', ephermal: true });
            }
            else {
                const command = bot.commands.get(`ticket-${option}`);
                if (command) {
                    command.callback(bot, interaction, guild, args);
                }
                else {
                    interaction.reply({ content: 'Error' });
                }
            }
        });
    }
    /**
     * Function for sending reaction/button embed
     * @param {bot} bot The instantiating client
     * @param {channel} channel The channel that will show the embed
     * @readonly
    */
    sendReactionEmbed(bot, channel) {
        return __awaiter(this, void 0, void 0, function* () {
            const { guild } = channel;
            const embed = new Embed(bot, guild)
                .setTitle('ticket/ticket:TITLE_REACT')
                .setDescription(guild.translate('ticket/ticket:REACT_DESC', { PREFIX: guild.settings.prefix }));
            // Create button
            const row = new ActionRowBuilder()
                .addComponents(new ButtonBuilder()
                .setCustomId('crt_ticket')
                .setLabel('Create ticket')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('📩'));
            yield channel.send({ embeds: [embed], components: [row] });
        });
    }
}
module.exports = Ticket;
