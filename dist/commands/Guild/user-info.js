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
const { Embed } = require('../../utils'), moment = require('moment'), { ApplicationCommandOptionType, PermissionsBitField: { Flags }, GuildMember } = require('discord.js'), { ChannelType } = require('discord-api-types/v10'), Command = require('../../structures/Command.js');
/**
 * User-info command
 * @extends {Command}
*/
class UserInfo extends Command {
    /**
   * @param {Client} client The instantiating client
   * @param {CommandData} data The data for the command
  */
    constructor(bot) {
        super(bot, {
            name: 'user-info',
            guildOnly: true,
            dirname: __dirname,
            aliases: ['userinfo', 'whois'],
            botPermissions: [Flags.SendMessages, Flags.EmbedLinks],
            description: 'Get information on a user.',
            usage: 'user-info [user]',
            cooldown: 2000,
            examples: ['user-info userID', 'user-info @mention', 'user-info username'],
            slash: true,
            options: [{
                    name: 'user',
                    description: 'The user you want to get information of',
                    type: ApplicationCommandOptionType.User,
                    required: false,
                }],
        });
    }
    /**
     * Function for receiving message.
     * @param {bot} bot The instantiating client
     * @param {message} message The message that ran the command.
     * @readonly
    */
    run(bot, message) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get user
            const members = yield message.getMember();
            const embed = this.createEmbed(bot, message.guild, members[0]);
            // send user info
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
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const member = guild.members.cache.get((_b = (_a = args.get('user')) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : interaction.user.id);
            // send embed
            const embed = yield this.createEmbed(bot, guild, member);
            interaction.reply({ embeds: [embed] });
        });
    }
    /**
     * Function for receiving slash command.
     * @param {bot} bot The instantiating client
     * @param {interaction} interaction The interaction that ran the command
     * @param {guild} guild The guild the interaction ran in
     * @param {args} args The options provided in the command, if any
     * @readonly
    */
    reply(bot, interaction, channel, userID) {
        let member;
        if (channel.type == ChannelType.DM) {
            member = new GuildMember(bot, bot.users.cache.get(userID));
            member._patch({ user: bot.users.cache.get(userID) });
        }
        else {
            member = channel.guild.members.cache.get(userID);
        }
        // send embed
        const embed = this.createEmbed(bot, false, member);
        return interaction.reply({ embeds: [embed] });
    }
    /**
     * Function for creating embed of user information
     * @param {bot} bot The instantiating client
     * @param {guild} Guild The guild the command was ran in
     * @param {user} GuildMember The member to get information of
     * @returns {embed}
    */
    createEmbed(bot, guild, member) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        let status = 'None';
        if (member.guild) {
            status = (((_a = member.presence) === null || _a === void 0 ? void 0 : _a.activities.length) >= 1) ? `${member.presence.activities[0].name} - ${(member.presence.activities[0].type == 'CUSTOM_STATUS') ? member.presence.activities[0].state : member.presence.activities[0].details}` : 'None';
        }
        const embed = new Embed(bot, guild)
            .setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL() })
            .setColor(3447003)
            .setThumbnail(member.user.displayAvatarURL({ format: 'png', size: 512 }))
            .addFields({ name: bot.translate('guild/user-info:USERNAME', {}, (_b = guild.settings) === null || _b === void 0 ? void 0 : _b.Language), value: member.user.username, inline: true }, { name: bot.translate('guild/user-info:DISCRIM', {}, (_c = guild.settings) === null || _c === void 0 ? void 0 : _c.Language), value: `${member.user.discriminator}`, inline: true }, { name: bot.translate('guild/user-info:ROBOT', {}, (_d = guild.settings) === null || _d === void 0 ? void 0 : _d.Language), value: bot.translate(`misc:${member.user.bot ? 'YES' : 'NO'}`, {}, (_e = guild.settings) === null || _e === void 0 ? void 0 : _e.Language), inline: true }, { name: bot.translate('guild/user-info:CREATE', {}, (_f = guild.settings) === null || _f === void 0 ? void 0 : _f.Language), value: moment(member.user.createdAt).format('lll'), inline: true }, { name: bot.translate('guild/user-info:STATUS', {}, (_g = guild.settings) === null || _g === void 0 ? void 0 : _g.Language), value: `\`${status}\``, inline: true });
        if (member.guild) {
            embed.addFields({ name: bot.translate('guild/user-info:ROLE', {}, (_h = guild.settings) === null || _h === void 0 ? void 0 : _h.Language), value: `${member.roles.highest}`, inline: true }, { name: bot.translate('guild/user-info:JOIN', {}, (_j = guild.settings) === null || _j === void 0 ? void 0 : _j.Language), value: moment(member.joinedAt).format('lll'), inline: true }, { name: bot.translate('guild/user-info:NICK', {}, (_k = guild.settings) === null || _k === void 0 ? void 0 : _k.Language), value: member.nickname != null ? member.nickname : bot.translate('misc:NONE', {}, (_l = guild.settings) === null || _l === void 0 ? void 0 : _l.Language), inline: true }, { name: bot.translate('guild/user-info:ROLES', {}, (_m = guild.settings) === null || _m === void 0 ? void 0 : _m.Language), value: member.roles.cache.sort((a, b) => b.rawPosition - a.rawPosition).reduce((a, b) => `${a}, ${b}`) });
        }
        return embed;
    }
}
module.exports = UserInfo;
