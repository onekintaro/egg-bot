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
const { Embed } = require('../../utils'), { ApplicationCommandOptionType, PermissionsBitField: { Flags }, GuildMember } = require('discord.js'), { ChannelType } = require('discord-api-types/v10'), Command = require('../../structures/Command.js');
/**
 * Avatar command
 * @extends {Command}
*/
class Avatar extends Command {
    /**
   * @param {Client} client The instantiating client
   * @param {CommandData} data The data for the command
  */
    constructor(bot) {
        super(bot, {
            name: 'avatar',
            guildOnly: true,
            dirname: __dirname,
            aliases: ['av'],
            botPermissions: [Flags.SendMessages, Flags.EmbedLinks],
            description: 'Displays user\'s avatar.',
            usage: 'avatar [user]',
            cooldown: 2000,
            examples: ['avatar userID', 'avatar @mention', 'avatar username'],
            slash: true,
            options: [{
                    name: 'user',
                    description: 'The user you want the avatar of',
                    type: ApplicationCommandOptionType.User,
                    required: false,
                }],
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
            // Get avatar embed
            const members = yield message.getMember();
            const embed = this.avatarEmbed(bot, message.guild, members[0]);
            // send embed
            message.channel.send({ embeds: [embed] });
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
    callback(bot, interaction, guild, args) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const member = guild.members.cache.get((_b = (_a = args.get('user')) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : interaction.user.id);
            const embed = this.avatarEmbed(bot, guild, member);
            // send embed
            return interaction.reply({ embeds: [embed] });
        });
    }
    /**
     * Function for receiving context menu
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
        const embed = this.avatarEmbed(bot, false, member);
        return interaction.reply({ embeds: [embed] });
    }
    /**
     * Function for creating avatar embed.
     * @param {bot} bot The instantiating client
     * @param {guild} guild The guild the command ran in
     * @param {member} GuildMember The guildMember to get the avatar from
     * @returns {embed}
    */
    avatarEmbed(bot, guild, member) {
        return new Embed(bot, guild)
            .setTitle('guild/avatar:AVATAR_TITLE', { USER: member.user.tag })
            .setDescription([
            `${bot.translate('guild/avatar:AVATAR_DESCRIPTION')}`,
            `[png](${member.user.displayAvatarURL({ format: 'png', size: 1024 })}) | [jpg](${member.user.displayAvatarURL({ format: 'jpg', size: 1024 })}) | [gif](${member.user.displayAvatarURL({ format: 'gif', size: 1024, dynamic: true })}) | [webp](${member.user.displayAvatarURL({ format: 'webp', size: 1024 })})`,
        ].join('\n'))
            .setImage(`${member.user.displayAvatarURL({ dynamic: true, size: 1024 })}`);
    }
}
module.exports = Avatar;
