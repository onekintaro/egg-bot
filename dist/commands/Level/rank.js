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
const { AttachmentBuilder, ApplicationCommandOptionType, PermissionsBitField: { Flags } } = require('discord.js'), { Rank: rank } = require('canvacord'), Command = require('../../structures/Command.js');
/**
 * Rank command
 * @extends {Command}
*/
class Rank extends Command {
    /**
     * @param {Client} client The instantiating client
     * @param {CommandData} data The data for the command
    */
    constructor(bot) {
        super(bot, {
            name: 'rank',
            guildOnly: true,
            dirname: __dirname,
            aliases: ['lvl', 'level'],
            botPermissions: [Flags.SendMessages, Flags.EmbedLinks, Flags.AttachFiles],
            description: 'Shows your rank/Level.',
            usage: 'level [username]',
            cooldown: 3000,
            examples: ['level userID', 'level @mention', 'level username'],
            slash: true,
            options: [{
                    name: 'user',
                    description: 'The user you want to view the rank of.',
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
            // Get user
            const members = yield message.getMember();
            // send 'waiting' message to show bot has recieved message
            const msg = yield message.channel.send(message.translate('misc:FETCHING', {
                EMOJI: message.channel.checkPerm('USE_EXTERNAL_EMOJIS') ? bot.customEmojis['loading'] : '', ITEM: this.help.name
            }));
            // Retrieve Rank from databse
            try {
                const res = yield this.createRankCard(bot, message.guild, message.author, members[0], message.channel);
                msg.delete();
                if (typeof (res) == 'object' && !res.description) {
                    yield message.channel.send({ files: [res] });
                }
                else if (res.description) {
                    yield message.channel.send({ embeds: [res] });
                }
                else {
                    yield message.channel.send(res);
                }
            }
            catch (err) {
                msg.delete();
                bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
                message.channel.error('misc:ERROR_MESSAGE', { ERROR: err.message });
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
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const channel = guild.channels.cache.get(interaction.channelId), member = (_b = guild.members.cache.get((_a = args.get('user')) === null || _a === void 0 ? void 0 : _a.value)) !== null && _b !== void 0 ? _b : interaction.member;
            // Retrieve Rank from databse
            try {
                const res = yield this.createRankCard(bot, guild, interaction.user, member, channel);
                if (typeof (res) == 'object') {
                    yield interaction.reply({ files: [res] });
                }
                else {
                    yield interaction.reply({ content: res });
                }
            }
            catch (err) {
                bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
                return interaction.reply({ ephemeral: true, embeds: [channel.error('misc:ERROR_MESSAGE', { ERROR: err.message }, true)] });
            }
        });
    }
    /**
     * Function for fetching meme embed.
     * @param {bot} bot The instantiating client
     * @param {guild} guild The guild the command ran in
     * @param {author} User The user who ran the command
     * @param {target} guildMember The member who's rank is being checked
     * @param {channel} channel The channel the command ran in
     * @returns {embed}
    */
    createRankCard(bot, guild, author, target, channel) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            // make sure it's not a bot
            if (target.user.bot)
                return channel.error('level/rank:NO_BOTS', {}, true);
            // sort and find user
            const res = guild.levels.sort(({ Xp: a }, { Xp: b }) => b - a);
            const user = res.find(doc => doc.userID == target.user.id);
            // if they haven't send any messages
            if (!user) {
                if (author.id == target.user.id)
                    return channel.error('level/rank:NO_MESSAGES', { ERROR: null }, true);
                return channel.error('level/rank:MEMBER_MESSAGE', { ERROR: null }, true);
            }
            // Get rank
            const rankScore = res.indexOf(res.find(i => i.userID == target.user.id));
            // create rank card
            const rankcard = new rank()
                .setAvatar(target.user.displayAvatarURL({ extension: 'png', forceStatic: true, size: 1024 }))
                .setCurrentXP(user.Level == 1 ? user.Xp : (user.Xp - (5 * ((user.Level - 1) ** 2) + 50 * (user.Level - 1) + 100)))
                .setLevel(user.Level)
                .setRank(rankScore + 1)
                .setRequiredXP((5 * (user.Level ** 2) + 50 * user.Level + 100) - (user.Level == 1 ? 0 : (5 * ((user.Level - 1) ** 2) + 50 * (user.Level - 1) + 100)))
                .setStatus((_b = (_a = target.presence) === null || _a === void 0 ? void 0 : _a.status) !== null && _b !== void 0 ? _b : 'dnd')
                .setProgressBar(['#FFFFFF', '#DF1414'], 'GRADIENT')
                .setUsername(target.user.username)
                .setDiscriminator(target.user.discriminator);
            //	if (target.user.rankImage && target.user.premium) rankcard.setBackground('IMAGE', target.user.rankImage);
            // create rank card
            const buffer = yield rankcard.build();
            console.log(buffer);
            return new AttachmentBuilder(buffer, { name: 'RankCard.png' });
        });
    }
}
module.exports = Rank;
