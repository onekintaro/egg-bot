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
const { Embed } = require('../../utils'), { Node } = require('erela.js'), { ApplicationCommandOptionType, PermissionsBitField: { Flags } } = require('discord.js'), Command = require('../../structures/Command.js');
/**
 * Lavalink command
 * @extends {Command}
*/
class Lavalink extends Command {
    /**
     * @param {Client} client The instantiating client
     * @param {CommandData} data The data for the command
    */
    constructor(bot) {
        super(bot, {
            name: 'lavalink',
            ownerOnly: true,
            dirname: __dirname,
            botPermissions: [Flags.SendMessages, Flags.EmbedLinks],
            description: 'Interact with the Lavalink nodes',
            usage: 'lavalink [list | add | remove] <information>',
            cooldown: 3000,
            slash: true,
            options: [{
                    name: 'option',
                    description: 'The link or name of the track.',
                    type: ApplicationCommandOptionType.String,
                    choices: [...['list', 'add', 'remove'].map(i => ({ name: i, value: i }))],
                    required: true,
                }],
        });
    }
    /**
     * Function for receiving message.
     * @param {bot} bot The instantiating client
     * @param {message} message The message that ran the command
     * @readonly
    */
    run(bot, message, settings) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return __awaiter(this, void 0, void 0, function* () {
            let msg, memory, cpu, uptime, playingPlayers, players;
            switch (message.args[0]) {
                case 'list': {
                    // show list of available nodes
                    const embed = new Embed(bot, message.guild)
                        .setTitle('Lavalink nodes:')
                        .setDescription(bot.manager.nodes.map((node, index, array) => {
                        var _a;
                        return `${array.map(({ options }) => options.host).indexOf(index) + 1}.) **${node.options.host}** (Uptime: ${this.uptime((_a = node.stats.uptime) !== null && _a !== void 0 ? _a : 0)})`;
                    }).join('\n'));
                    return message.channel.send({ embeds: [embed] });
                }
                case 'add':
                    try {
                        // Connect to new node
                        yield (new Node({
                            host: (_a = message.args[1]) !== null && _a !== void 0 ? _a : 'localhost',
                            password: (_b = message.args[2]) !== null && _b !== void 0 ? _b : 'youshallnotpass',
                            port: (_c = parseInt(message.args[3])) !== null && _c !== void 0 ? _c : 5000,
                        })).connect();
                        message.channel.success('host/node:ADDED_NODE');
                    }
                    catch (err) {
                        bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
                        message.channel.error('misc:ERROR_MESSAGE', { ERROR: err.message });
                    }
                    break;
                case 'remove':
                    try {
                        yield (new Node({
                            host: (_d = message.args[1]) !== null && _d !== void 0 ? _d : 'localhost',
                            password: (_e = message.args[2]) !== null && _e !== void 0 ? _e : 'youshallnotpass',
                            port: (_f = parseInt(message.args[3])) !== null && _f !== void 0 ? _f : 5000,
                        })).destroy();
                        message.channel.success('host/node:REMOVED_NODE');
                    }
                    catch (err) {
                        bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
                        message.channel.error('misc:ERROR_MESSAGE', { ERROR: err.message });
                    }
                    break;
                default:
                    if (bot.manager.nodes.get(message.args[0])) {
                        msg = yield message.channel.send(message.translate('host/lavalink:FETCHING')),
                            { memory, cpu, uptime, playingPlayers, players } = bot.manager.nodes.get(message.args[0]).stats;
                        // RAM usage
                        const allocated = Math.floor(memory.allocated / 1024 / 1024), used = Math.floor(memory.used / 1024 / 1024), free = Math.floor(memory.free / 1024 / 1024), reservable = Math.floor(memory.reservable / 1024 / 1024);
                        // CPU usage
                        const systemLoad = (cpu.systemLoad * 100).toFixed(2), lavalinkLoad = (cpu.lavalinkLoad * 100).toFixed(2);
                        // Lavalink uptime
                        const botUptime = this.uptime(uptime);
                        const embed = new Embed(bot, message.guild)
                            .setAuthor({ name: message.translate('host/lavalink:AUTHOR', { NAME: (_h = (_g = bot.manager.nodes.get(message.args[0])) === null || _g === void 0 ? void 0 : _g.options.host) !== null && _h !== void 0 ? _h : bot.manager.nodes.first().options.host }) })
                            .addFields({ name: message.translate('host/lavalink:PLAYERS'), value: message.translate('host/lavalink:PLAYER_STATS', { PLAYING: playingPlayers, PLAYERS: players }) }, { name: message.translate('host/lavalink:MEMORY'), value: message.translate('host/lavalink:MEMORY_STATS', { ALL: allocated, USED: used, FREE: free, RESERVE: reservable }) }, { name: message.translate('host/lavalink:CPU'), value: message.translate('host/lavalink:CPU_STATS', { CORES: cpu.cores, SYSLOAD: systemLoad, LVLLOAD: lavalinkLoad }) }, { name: message.translate('host/lavalink:UPTIME'), value: message.translate('host/lavalink:UPTIME_STATS', { NUM: botUptime }) })
                            .setTimestamp(Date.now());
                        return msg.edit({ content: ' ', embeds: [embed] });
                    }
                    else {
                        return message.channel.error('misc:INCORRECT_FORMAT', { EXAMPLE: settings.prefix.concat(message.translate('host/lavalink:USAGE')) });
                    }
            }
        });
    }
    /**
     * Function for receiving interaction.
     * @param {bot} bot The instantiating client
     * @param {interaction} interaction The interaction that ran the command
     * @param {guild} guild The guild the interaction ran in
     * @readonly
    */
    callback(bot, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            interaction.reply({ content: 'This is currently unavailable.' });
        });
    }
    /**
     * Function for turning number to timestamp.
     * @param {time} number The uptime of the lavalink server
     * @returns {String}
    */
    uptime(time) {
        const calculations = {
            week: Math.floor(time / (1000 * 60 * 60 * 24 * 7)),
            day: Math.floor(time / (1000 * 60 * 60 * 24)),
            hour: Math.floor((time / (1000 * 60 * 60)) % 24),
            minute: Math.floor((time / (1000 * 60)) % 60),
            second: Math.floor((time / 1000) % 60),
        };
        if (calculations.week >= 1)
            calculations.days -= calculations.week * 7;
        let str = '';
        for (const [key, val] of Object.entries(calculations)) {
            if (val > 0)
                str += `${val} ${key}${val > 1 ? 's' : ''} `;
        }
        return str;
    }
}
module.exports = Lavalink;
