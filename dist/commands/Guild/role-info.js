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
const { Embed } = require('../../utils'), moment = require('moment'), { ApplicationCommandOptionType, PermissionsBitField: { Flags }, } = require('discord.js'), Command = require('../../structures/Command.js');
/**
 * Role-info command
 * @extends {Command}
*/
class RoleInfo extends Command {
    /**
   * @param {Client} client The instantiating client
   * @param {CommandData} data The data for the command
  */
    constructor(bot) {
        super(bot, {
            name: 'role-info',
            guildOnly: true,
            dirname: __dirname,
            aliases: ['roleinfo'],
            botPermissions: [Flags.SendMessages, Flags.EmbedLinks],
            description: 'Get information on a role.',
            usage: 'role-info <role>',
            cooldown: 2000,
            examples: ['role-info roleID', 'role-info @mention', 'role-info name'],
            slash: true,
            options: [{
                    name: 'role',
                    description: 'Get information of the role.',
                    type: ApplicationCommandOptionType.Role,
                    required: true,
                }],
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
            // Check to see if a role was mentioned
            const roles = message.getRole();
            // Make sure it's a role on the server
            if (!roles[0]) {
                if (message.deletable)
                    message.delete();
                // Make sure a poll was provided
                return message.channel.error('misc:INCORRECT_FORMAT', { EXAMPLE: settings.prefix.concat(message.translate('guild/role-info:USAGE')) });
            }
            const embed = this.createEmbed(bot, message.guild, roles[0], message.author);
            message.channel.send({ embeds: [embed] });
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
            const role = guild.roles.cache.get(args.get('role').value);
            const user = interaction.member.user;
            // send embed
            const embed = this.createEmbed(bot, guild, role, user);
            interaction.reply({ embeds: [embed] });
        });
    }
    /**
     * Function for creating embed of role information.
     * @param {bot} bot The instantiating client
     * @param {guild} Guild The guild the command was ran in
     * @param {role} Role The role to get information from
     * @param {user} User The user for embed#footer
     * @returns {embed}
    */
    createEmbed(bot, guild, role, user) {
        // translate permissions
        const permissions = role.permissions.toArray().map((p) => guild.translate(`permissions:${p}`)).join(' » ');
        // Send information to channel
        return new Embed(bot, guild)
            .setColor(role.color)
            .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
            .setDescription(guild.translate('guild/role-info:NAME', { NAME: role.name }))
            .addFields({ name: guild.translate('guild/role-info:MEMBERS'), value: role.members.size.toLocaleString(guild.settings.Language), inline: true }, { name: guild.translate('guild/role-info:COLOR'), value: role.hexColor, inline: true }, { name: guild.translate('guild/role-info:POSITION'), value: `${role.position}`, inline: true }, { name: guild.translate('guild/role-info:MENTION'), value: `<@&${role.id}>`, inline: true }, { name: guild.translate('guild/role-info:HOISTED'), value: `${role.hoist}`, inline: true }, { name: guild.translate('guild/role-info:MENTIONABLE'), value: `${role.mentionable}`, inline: true }, { name: guild.translate('guild/role-info:PERMISSION'), value: permissions }, { name: guild.translate('guild/role-info:CREATED'), value: moment(role.createdAt).format('lll') })
            .setTimestamp()
            .setFooter({ text: guild.translate('guild/role-info:FOOTER', { MEMBER: user.tag, ID: role.id }) });
    }
}
module.exports = RoleInfo;
