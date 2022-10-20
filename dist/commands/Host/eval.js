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
const { inspect } = require('util'), { EmbedBuilder, ApplicationCommandOptionType, PermissionsBitField: { Flags } } = require('discord.js'), Command = require('../../structures/Command.js');
/**
 * Eval command
 * @extends {Command}
*/
class Eval extends Command {
    /**
     * @param {Client} client The instantiating client
     * @param {CommandData} data The data for the command
    */
    constructor(bot) {
        super(bot, {
            name: 'eval',
            ownerOnly: true,
            dirname: __dirname,
            botPermissions: [Flags.SendMessages, Flags.EmbedLinks],
            description: 'Evaluates JS code.',
            usage: 'eval <code>',
            cooldown: 3000,
            examples: ['eval bot.users.cache.get(\'184376969016639488\')'],
            slash: true,
            options: [{
                    name: 'code',
                    description: 'The code to evaluate.',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                }],
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
            // Evaluated the code
            const toEval = message.args.join(' ');
            try {
                if (toEval) {
                    // Auto-complete commands
                    const hrStart = process.hrtime(), evaluated = yield eval(toEval, { depth: 0 }), hrDiff = process.hrtime(hrStart);
                    const embed = new EmbedBuilder()
                        .addFields({ name: 'Input:\n', value: '```js\n' + `${toEval.substring(0, 1010)}` + '```' }, { name: 'Output:\n', value: '```js\n' + `${inspect(evaluated).substring(0, 1010)}` + '```' }, { name: 'Time:\n', value: `*Executed in ${hrDiff[0] > 0 ? `${hrDiff[0]}s` : ''}${hrDiff[1] / 1000000}ms.*`, inline: true }, { name: 'Type:\n', value: `${typeof (evaluated)}`, inline: true });
                    message.channel.send({ embeds: [embed] });
                }
                else {
                    message.channel.error('misc:INCORRECT_FORMAT', { EXAMPLE: settings.prefix.concat(message.translate('host/eval:USAGE')) });
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
     * @readonly
    */
    callback(bot, interaction, guild, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const channel = guild.channels.cache.get(interaction.channelId), { settings } = guild, toEval = args.get('code').value;
            try {
                if (toEval) {
                    // Auto-complete commands
                    const hrStart = process.hrtime(), evaluated = yield eval(toEval, { depth: 0 }), hrDiff = process.hrtime(hrStart);
                    const embed = new EmbedBuilder()
                        .addFields({ name: 'Input:\n', value: '```js\n' + `${toEval.substring(0, 1010)}` + '```' }, { name: 'Output:\n', value: '```js\n' + `${inspect(evaluated).substring(0, 1010)}` + '```' }, { name: 'Time:\n', value: `*Executed in ${hrDiff[0] > 0 ? `${hrDiff[0]}s` : ''}${hrDiff[1] / 1000000}ms.*`, inline: true }, { name: 'Type:\n', value: `${typeof (evaluated)}`, inline: true });
                    interaction.reply({ embeds: [embed] });
                }
                else {
                    interaction.reply({ embeds: [channel.error('misc:INCORRECT_FORMAT', { EXAMPLE: settings.prefix.concat(guild.translate('host/eval:USAGE')) }, true)] });
                }
            }
            catch (err) {
                bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
                interaction.reply({ embed: [channel.error('misc:ERROR_MESSAGE', { ERROR: err.message })] });
            }
        });
    }
}
module.exports = Eval;