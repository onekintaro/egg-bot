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
const { Embed } = require('../../utils'), { PermissionsBitField: { Flags } } = require('discord.js'), Command = require('../../structures/Command.js');
/**
 * set plugin command
 * @extends {Command}
*/
class SetPlugin extends Command {
    /**
 * @param {Client} client The instantiating client
 * @param {CommandData} data The data for the command
*/
    constructor(bot) {
        super(bot, {
            name: 'set-plugin',
            guildOnly: true,
            dirname: __dirname,
            aliases: ['setplugin'],
            userPermissions: [Flags.ManageGuild],
            botPermissions: [Flags.SendMessages, Flags.EmbedLinks],
            description: 'Toggle plugins on and off',
            usage: 'set-plugin <option>',
            cooldown: 5000,
            examples: ['set-plugin', 'setplugin Giveaway'],
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
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            // Get all the command categories
            const defaultPlugins = bot.commands.map(c => c.help.category).filter((v, i, a) => a.indexOf(v) === i && v != 'Host');
            // Delete message
            if (settings.ModerationClearToggle && message.deletable)
                message.delete();
            // Make sure something was entered
            if (!message.args[0]) {
                const embed = new Embed(bot, message.guild)
                    .setTitle('Plugins')
                    .setDescription([
                    `Available plugins: \`${defaultPlugins.filter(item => !settings.plugins.includes(item)).join('`, `')}\`.`,
                    '',
                    `Active plugins: \`${settings.plugins.join('`, `')}\`.`,
                ].join('\n'));
                return message.channel.send({ embeds: [embed] });
            }
            // make sure it's a real plugin
            if (defaultPlugins.includes(message.args[0])) {
                if (!settings.plugins.includes(message.args[0])) {
                    const data = [];
                    settings.plugins.push(message.args[0]);
                    // Fetch slash command data
                    for (const plugin of settings.plugins) {
                        const g = yield bot.loadInteractionGroup(plugin, message.guild);
                        if (Array.isArray(g))
                            data.push(...g);
                    }
                    try {
                        yield ((_a = bot.guilds.cache.get(message.guild.id)) === null || _a === void 0 ? void 0 : _a.commands.set(data));
                    }
                    catch (err) {
                        console.log(err);
                    }
                    message.channel.success('plugins/set-plugin:ADDED', { PLUGINS: message.args[0] });
                    if (settings.plugins.includes('Level'))
                        yield message.guild.fetchLevels();
                }
                else {
                    const data = [];
                    settings.plugins.splice(settings.plugins.indexOf(message.args[0]), 1);
                    // Fetch slash command data
                    for (const plugin of settings.plugins) {
                        const g = yield bot.loadInteractionGroup(plugin, message.guild);
                        if (Array.isArray(g))
                            data.push(...g);
                    }
                    try {
                        yield ((_b = bot.guilds.cache.get(message.guild.id)) === null || _b === void 0 ? void 0 : _b.commands.set(data));
                    }
                    catch (err) {
                        console.log(err);
                    }
                    message.channel.success('plugins/set-plugin:REMOVED', { PLUGINS: message.args[0] });
                }
                try {
                    yield message.guild.updateGuild({ plugins: settings.plugins });
                }
                catch (err) {
                    bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
                    message.channel.error('misc:ERROR_MESSAGE', { ERROR: err.message });
                }
            }
            else {
                return message.channel.error('plugins/set-plugin:INVALID');
            }
        });
    }
}
module.exports = SetPlugin;
