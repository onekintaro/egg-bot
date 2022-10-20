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
 * Status command
 * @extends {Command}
*/
class Status extends Command {
    /**
     * @param {Client} client The instantiating client
     * @param {CommandData} data The data for the command
    */
    constructor(bot) {
        super(bot, {
            name: 'status',
            dirname: __dirname,
            aliases: ['stat', 'ping'],
            botPermissions: [Flags.SendMessages, Flags.EmbedLinks],
            description: 'Gets the status of the bot.',
            usage: 'status',
            cooldown: 2000,
            slash: true,
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
            // Get information on the services the bot provide
            const m = yield message.channel.send(message.translate('misc/status:PONG'));
            const embed = new Embed(bot, message.guild)
                .addFields({ name: bot.translate('misc/status:PING'), value: `\`${m.createdTimestamp - message.createdTimestamp}ms\``, inline: true }, { name: bot.translate('misc/status:CLIENT'), value: `\`${Math.round(bot.ws.ping)}ms\``, inline: true }, { name: bot.translate('misc/status:MONGO'), value: `\`${Math.round(yield bot.mongoose.ping())}ms\``, inline: true })
                .setTimestamp();
            yield message.channel.send({ embeds: [embed] });
            m.delete();
        });
    }
    /**
     * Function for receiving interaction.
     * @param {bot} bot The instantiating client
     * @param {interaction} interaction The interaction that ran the command
     * @param {guild} guild The guild the interaction ran in
     * @readonly
    */
    callback(bot, interaction, guild) {
        return __awaiter(this, void 0, void 0, function* () {
            const msg = yield interaction.reply({ content: guild.translate('misc/status:PONG'), fetchReply: true });
            const embed = new Embed(bot, guild)
                .addFields({ name: bot.translate('misc/status:PING'), value: `\`${msg.createdTimestamp - interaction.createdTimestamp}ms\``, inline: true }, { name: bot.translate('misc/status:CLIENT'), value: `\`${Math.round(bot.ws.ping)}ms\``, inline: true }, { name: bot.translate('misc/status:MONGO'), value: `\`${Math.round(yield bot.mongoose.ping())}ms\``, inline: true })
                .setTimestamp();
            yield interaction.editReply({ content: '‎', embeds: [embed] });
        });
    }
}
module.exports = Status;
