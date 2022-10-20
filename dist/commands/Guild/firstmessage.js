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
const { Embed } = require('../../utils'), { ApplicationCommandOptionType, PermissionsBitField: { Flags } } = require('discord.js'), { ChannelType } = require('discord-api-types/v10'), Command = require('../../structures/Command.js');
/**
 * Firstmessage command
 * @extends {Command}
*/
class Firstmessage extends Command {
    /**
   * @param {Client} client The instantiating client
   * @param {CommandData} data The data for the command
  */
    constructor(bot) {
        super(bot, {
            name: 'firstmessage',
            guildOnly: true,
            dirname: __dirname,
            aliases: ['firstmsg', 'first-msg'],
            botPermissions: [Flags.SendMessages, Flags.EmbedLinks],
            description: 'Gets the first message from the channel.',
            usage: 'firstmessage [channel]',
            cooldown: 2000,
            slash: true,
            options: [{
                    name: 'channel',
                    description: 'The specified channel to grab the first message of.',
                    type: ApplicationCommandOptionType.Channel,
                    channelTypes: [ChannelType.GuildText, ChannelType.GuildPublicThread, ChannelType.GuildPrivateThread, ChannelType.GuildNews],
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
            // get channel
            const channel = message.getChannel();
            try {
                // get first message in channel
                const fMessage = yield channel[0].messages.fetch({ after: 1, limit: 1 }).then(msg => msg.first());
                const embed = this.createEmbed(bot, message.guild, fMessage);
                // send embed
                message.channel.send({ embeds: [embed] });
            }
            catch (err) {
                if (message.deletable)
                    message.delete();
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
            const channel = guild.channels.cache.get((_b = (_a = args.get('channel')) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : interaction.channelId);
            try {
                // get first message in channel
                const fMessage = yield channel.messages.fetch({ after: 1, limit: 1 }).then(msg => msg.first());
                const embed = this.createEmbed(bot, guild, fMessage);
                // send embed
                interaction.reply({ embeds: [embed] });
            }
            catch (err) {
                bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
                interaction.reply({ embeds: [channel.error('misc:ERROR_MESSAGE', { ERROR: err.message }, true)], ephemeral: true });
            }
        });
    }
    /**
     * Function for creating first message embed.
     * @param {bot} bot The instantiating client
     * @param {guild} guild The guild the command ran in
     * @param {fMessage} Message The first message of the channel
     * @returns {embed}
    */
    createEmbed(bot, guild, fMessage) {
        return new Embed(bot, guild)
            .setColor(fMessage.member ? fMessage.member.displayHexColor : 0x00AE86)
            .setThumbnail(fMessage.author.displayAvatarURL({ format: 'png', dynamic: true }))
            .setAuthor({ name: fMessage.author.tag, iconURL: fMessage.author.displayAvatarURL({ format: 'png', dynamic: true }) })
            .setDescription(fMessage.content)
            .addFields({ name: bot.translate('guild/firstmessage:JUMP'), value: fMessage.url })
            .setFooter({ text: guild.translate('misc:ID', { ID: fMessage.id }) })
            .setTimestamp(fMessage.createdAt);
    }
}
module.exports = Firstmessage;
