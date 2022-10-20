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
const { ApplicationCommandOptionType, PermissionsBitField: { Flags } } = require('discord.js'), { ChannelType } = require('discord-api-types/v10'), Command = require('../../structures/Command.js');
/**
 * Lock command
 * @extends {Command}
*/
class Lock extends Command {
    /**
     * @param {Client} client The instantiating client
     * @param {CommandData} data The data for the command
    */
    constructor(bot) {
        super(bot, {
            name: 'lock',
            guildOnly: true,
            dirname: __dirname,
            aliases: ['lockdown'],
            userPermissions: [Flags.ManageChannels],
            botPermissions: [Flags.SendMessages, Flags.EmbedLinks, Flags.ManageChannels],
            description: 'Lockdown a channel',
            usage: 'lock [channel]',
            cooldown: 5000,
            examples: ['lock @channel'],
            slash: false,
            options: [
                {
                    name: 'channel',
                    description: 'The channel to lock.',
                    type: ApplicationCommandOptionType.Channel,
                    channelTypes: [ChannelType.GuildText, ChannelType.GuildPublicThread, ChannelType.PrivateThread, ChannelType.GuildNews],
                    required: true,
                },
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
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            // Delete message
            if (settings.ModerationClearToggle && message.deletable)
                message.delete();
            // Get channel and update permissions
            const channel = message.getChannel()[0];
            try {
                yield channel.permissionOverwrites.edit(message.guild.roles.everyone, {
                    SendMessages: false,
                });
                for (const role of ((_a = settings.welcomeRoleGive) !== null && _a !== void 0 ? _a : [])) {
                    yield channel.permissionOverwrites.edit(role, {
                        SendMessages: false,
                    });
                }
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
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const channel = guild.channels.cache.get(args.get('channel').value);
            // Get channel and update permissions
            try {
                yield channel.permissionOverwrites.edit(guild.roles.everyone, {
                    SendMessages: false,
                });
                for (const role of ((_a = guild.settings.welcomeRoleGive) !== null && _a !== void 0 ? _a : [])) {
                    yield channel.permissionOverwrites.edit(role, {
                        SendMessages: false,
                    });
                }
            }
            catch (err) {
                bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
                interaction.reply({ embeds: [channel.error('misc:ERROR_MESSAGE', { ERROR: err.message }, true)] });
            }
        });
    }
}
module.exports = Lock;
