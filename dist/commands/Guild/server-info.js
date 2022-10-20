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
const { Embed } = require('../../utils'), moment = require('moment'), { PermissionsBitField: { Flags } } = require('discord.js'), Command = require('../../structures/Command.js');
/**
 * Server-info command
 * @extends {Command}
*/
class ServerInfo extends Command {
    /**
   * @param {Client} client The instantiating client
   * @param {CommandData} data The data for the command
  */
    constructor(bot) {
        super(bot, {
            name: 'server-info',
            guildOnly: true,
            dirname: __dirname,
            aliases: ['serverinfo', 'guildinfo'],
            botPermissions: [Flags.SendMessages, Flags.EmbedLinks],
            description: 'Get information on the server.',
            usage: 'server-info',
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
            // Sort roles by position
            const embed = yield this.createEmbed(bot, message.guild, message.author);
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
            const user = interaction.member.user;
            // send embed
            const embed = yield this.createEmbed(bot, guild, user);
            interaction.reply({ embeds: [embed] });
        });
    }
    /**
     * Function for creating embed of server information.
     * @param {bot} bot The instantiating client
     * @param {guild} Guild The guild the command was ran in
     * @param {user} User The user for embed#footer
     * @returns {embed}
    */
    createEmbed(bot, guild, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const roles = [...guild.roles.cache.sort((a, b) => b.position - a.position).values()];
            while (roles.join(', ').length >= 1021) {
                roles.pop();
            }
            // Send server information
            const member = guild.members.cache;
            return new Embed(bot, guild)
                .setAuthor({ name: guild.translate('guild/server-info:AUTHOR', { NAME: guild.name }), iconURL: guild.iconURL() })
                .setColor(3447003)
                .setThumbnail(guild.iconURL())
                .addFields({ name: guild.translate('guild/server-info:NAME'), value: `\`${guild.name}\``, inline: true }, { name: guild.translate('guild/server-info:OWNER'), value: `\`${yield guild.fetchOwner().then(m => m.user.tag)}\``, inline: true }, { name: guild.translate('guild/server-info:ID'), value: `\`${guild.id}\``, inline: true }, { name: guild.translate('guild/server-info:CREATED'), value: `\`${moment(guild.createdAt).format('MMMM Do YYYY')}\``, inline: true }, { name: guild.translate('guild/server-info:VERIFICATION'), value: `\`${guild.verificationLevel}\``, inline: true }, { name: guild.translate('guild/server-info:MEMBER', { NUM: guild.memberCount }), value: guild.translate('guild/server-info:MEMBER_DESC', {
                    ONLINE: member.filter(m => { var _a; return ((_a = m.presence) === null || _a === void 0 ? void 0 : _a.status) === 'online'; }).size.toLocaleString(guild.settings.Language), IDLE: member.filter(m => { var _a; return ((_a = m.presence) === null || _a === void 0 ? void 0 : _a.status) === 'idle'; }).size.toLocaleString(guild.settings.Language), DND: member.filter(m => { var _a; return ((_a = m.presence) === null || _a === void 0 ? void 0 : _a.status) === 'dnd'; }).size.toLocaleString(guild.settings.Language), BOTS: member.filter(m => m.user.bot).size.toLocaleString(guild.settings.Language), HUMANS: member.filter(m => !m.user.bot).size.toLocaleString(guild.settings.Language),
                }), inline: true }, { name: guild.translate('guild/server-info:FEATURES'), value: `\`${(guild.features.length == 0) ? guild.translate('misc:NONE') : guild.features.toString().toLowerCase().replace(/,/g, ', ')}\``, inline: true }, { name: guild.translate('guild/server-info:ROLES', { NUM: guild.roles.cache.size }), value: `${roles.join(', ')}${(roles.length != guild.roles.cache.size) ? '...' : '.'}` })
                .setTimestamp()
                .setFooter({ text: guild.translate('guild/server-info:FOOTER', { USER: user.tag }) });
        });
    }
}
module.exports = ServerInfo;
