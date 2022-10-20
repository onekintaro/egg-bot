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
const { Collection, PermissionsBitField } = require('discord.js'), Event = require('../../structures/Event');
/**
 * Slash create event
 * @event Egglord#SlashCreate
 * @extends {Event}
*/
class SlashCreate extends Event {
    constructor(...args) {
        super(...args, {
            dirname: __dirname,
        });
    }
    /**
     * Function for receiving event.
     * @param {bot} bot The instantiating client
     * @param {CommandInteraction} interaction The slash command used
     * @readonly
    */
    run(bot, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const guild = bot.guilds.cache.get(interaction.guildId), cmd = bot.commands.get(interaction.commandName), channel = guild.channels.cache.get(interaction.channelId), member = guild.members.cache.get(interaction.user.id);
            // Check to see if the command is being run in a blacklisted channel
            if ((guild.settings.CommandChannelToggle) && (guild.settings.CommandChannels.includes(channel.id))) {
                return interaction.reply({ embeds: [channel.error('events/message:BLACKLISTED_CHANNEL', { USER: member.user.tag }, true)], ephermal: true });
            }
            // Make sure NSFW commands are only being run in a NSFW channel
            if (!channel.nsfw && cmd.conf.nsfw) {
                return interaction.reply({ embeds: [channel.error('events/message:NOT_NSFW_CHANNEL', {}, true)], ephemeral: true });
            }
            // Check for bot permissions
            let neededPermissions = [];
            cmd.conf.botPermissions.forEach((perm) => {
                var _a;
                if ([PermissionsBitField.Flags.Speak, PermissionsBitField.Flags.Connect].includes(perm)) {
                    if (!member.voice.channel)
                        return;
                    if (!member.voice.channel.permissionsFor(bot.user).has(perm)) {
                        neededPermissions.push(perm);
                    }
                }
                else if (!((_a = channel.permissionsFor(bot.user)) === null || _a === void 0 ? void 0 : _a.has(perm))) {
                    neededPermissions.push(perm);
                }
            });
            // Display missing bot permissions
            if (neededPermissions.length > 0) {
                const perms = new PermissionsBitField();
                neededPermissions.forEach((item) => perms.add(BigInt(item)));
                bot.logger.error(`Missing permission: \`${perms.toArray().join(', ')}\` in [${guild.id}].`);
                return interaction.reply({ embeds: [channel.error('misc:MISSING_PERMISSION', { PERMISSIONS: perms.toArray().map((p) => bot.translate(`permissions:${p}`)).join(', ') }, true)], ephemeral: true });
            }
            // Check for user permissions
            neededPermissions = [];
            cmd.conf.userPermissions.forEach((perm) => {
                if (!channel.permissionsFor(member).has(perm))
                    neededPermissions.push(perm);
            });
            // Display missing user permissions
            if (neededPermissions.length > 0) {
                const perms = new PermissionsBitField();
                neededPermissions.forEach((item) => perms.add(BigInt(item)));
                return interaction.reply({ embeds: [channel.error('misc:USER_PERMISSION', { PERMISSIONS: perms.toArray().map((p) => bot.translate(`permissions:${p}`)).join(', ') }, true)], ephemeral: true });
            }
            // Check to see if user is in 'cooldown'
            if (!bot.cooldowns.has(cmd.help.name)) {
                bot.cooldowns.set(cmd.help.name, new Collection());
            }
            const now = Date.now(), timestamps = bot.cooldowns.get(cmd.help.name), cooldownAmount = (member.user.premium ? cmd.conf.cooldown * 0.75 : cmd.conf.cooldown);
            if (timestamps.has(interaction.user.id)) {
                const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
                if (now < expirationTime) {
                    const timeLeft = (expirationTime - now) / 1000;
                    return interaction.reply({ embeds: [channel.error('events/message:COMMAND_COOLDOWN', { NUM: timeLeft.toFixed(1) }, true)], ephemeral: true });
                }
            }
            // Run slash command
            if (bot.config.debug)
                bot.logger.debug(`Interaction: ${interaction.commandName} was ran by ${interaction.user.username}.`);
            setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
            yield cmd.callback(bot, interaction, guild, interaction.options);
            timestamps.set(interaction.user.id, now);
            this.commandsUsed++;
        });
    }
}
module.exports = SlashCreate;
