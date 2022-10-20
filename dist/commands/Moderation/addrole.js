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
const fs = require('fs'), { ApplicationCommandOptionType, PermissionsBitField: { Flags } } = require('discord.js'), Command = require('../../structures/Command.js');
/**
 * Addrole command
 * @extends {Command}
*/
class AddRole extends Command {
    /**
     * @param {Client} client The instantiating client
     * @param {CommandData} data The data for the command
    */
    constructor(bot) {
        super(bot, {
            name: 'addrole',
            guildOnly: true,
            dirname: __dirname,
            aliases: ['createrole'],
            userPermissions: [Flags.ManageRoles],
            botPermissions: [Flags.SendMessages, Flags.EmbedLinks, Flags.ManageRoles],
            description: 'Adds a new role to the server',
            usage: 'addrole <role name> [hex color] [hoist]',
            cooldown: 5000,
            examples: ['addrole Test #FF0000 true'],
            slash: false,
            options: [
                {
                    name: 'name',
                    description: 'Name of the new roll.',
                    type: ApplicationCommandOptionType.String,
                    maxLength: 100,
                    required: true,
                },
                {
                    name: 'colour',
                    description: 'colour of the new role',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    autocomplete: true,
                },
                {
                    name: 'hoist',
                    description: 'Should the role show seperately.',
                    type: ApplicationCommandOptionType.Boolean,
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
        return __awaiter(this, void 0, void 0, function* () {
            // Delete message
            if (settings.ModerationClearToggle && message.deletable)
                message.delete();
            // Make sure a role name was entered
            if (!message.args[0])
                return message.channel.error('misc:INCORRECT_FORMAT', { EXAMPLE: settings.prefix.concat(message.translate('moderation/addrole:USAGE')) });
            // Max character length of 100 for role name
            if (message.args[0].length >= 100)
                return message.channel.error('moderation/addrole:MAX_NAME');
            // Make sure 'hoist' is true or false
            if (message.args[2] && !['true', 'false'].includes(message.args[2]))
                return message.channel.error('moderation/addrole:BOOLEAN');
            // Make sure there isn't already the max number of roles in the guilds
            if (message.guild.roles.cache.size == 250)
                return message.channel.error('moderation/addrole:MAX_ROLES');
            // Check colour name for role
            fs.readFile('./src/assets/json/colours.json', (err, data) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c, _d, _e, _f;
                if (err) {
                    bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
                    return message.channel.error('misc:ERROR_MESSAGE', { ERROR: err.message });
                }
                // Create role
                const { colourNames } = JSON.parse(data);
                const colour = (_b = ((_a = message.args[1]) === null || _a === void 0 ? void 0 : _a.toLowerCase())) === null || _b === void 0 ? void 0 : _b.replace(/\s/g, '');
                if ((_c = colourNames[colour]) !== null && _c !== void 0 ? _c : /[0-9A-Fa-f]{6}/g.test(message.args[1])) {
                    const role = yield message.guild.roles.create({ name: message.args[0], reason: `Created by ${message.author.tag}`, color: (_d = colourNames[colour]) !== null && _d !== void 0 ? _d : message.args[1], hoist: (_e = message.args[2]) !== null && _e !== void 0 ? _e : false });
                    message.channel.success('moderation/addrole:SUCCESS', { ROLE: role.id }).then(m => m.timedDelete({ timeout: 5000 }));
                }
                else {
                    const role = yield message.guild.roles.create({ name: message.args[0], reason: `Created by ${message.author.tag}`, hoist: (_f = message.args[2]) !== null && _f !== void 0 ? _f : false });
                    message.channel.success('moderation/addrole:SUCCESS', { ROLE: role.id }).then(m => m.timedDelete({ timeout: 5000 }));
                }
            }));
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
            const channel = guild.channels.cache.get(interaction.channelId), name = args.get('name').value, color = args.get('colour').value, hoist = args.get('hoist').value;
            // Make sure there isn't already the max number of roles in the guilds
            if (guild.roles.cache.size == 250)
                return interaction.reply({ embeds: [channel.success('moderation/addrole:MAX_ROLES', {}, true)], fetchReply: true }).then(m => m.timedDelete({ timeout: 5000 }));
            try {
                const role = yield guild.roles.create({ name: name, reason: `Created by ${interaction.user.tag}`, color, hoist });
                interaction.channel.success('moderation/addrole:SUCCESS', { ROLE: role.id }).then(m => m.timedDelete({ timeout: 5000 }));
            }
            catch (err) {
                bot.logger.error(`Command: 'addrole' has error: ${err}.`);
                interaction.reply({ embeds: [channel.error('misc:ERROR_MESSAGE', { ERROR: err.message }, true)], ephemeral: true });
            }
        });
    }
}
module.exports = AddRole;
