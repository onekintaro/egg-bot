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
const { Embed } = require('../../utils'), { ApplicationCommandOptionType, PermissionsBitField: { Flags } } = require('discord.js'), Command = require('../../structures/Command.js');
/**
 * Poll command
 * @extends {Command}
*/
class Poll extends Command {
    /**
   * @param {Client} client The instantiating client
   * @param {CommandData} data The data for the command
  */
    constructor(bot) {
        super(bot, {
            name: 'poll',
            guildOnly: true,
            dirname: __dirname,
            botPermissions: [Flags.SendMessages, Flags.EmbedLinks, Flags.AddReactions],
            description: 'Create a poll for users to answer.',
            usage: 'poll <question>',
            cooldown: 2000,
            examples: ['poll Is this a good bot?'],
            slash: true,
            options: [
                {
                    name: 'poll',
                    description: 'What to poll.',
                    type: ApplicationCommandOptionType.String,
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
            if (settings.ModerationClearToggle && message.deletable)
                message.delete();
            // Make sure a poll was provided
            if (!message.args[0])
                return message.channel.error('misc:INCORRECT_FORMAT', { EXAMPLE: settings.prefix.concat(message.translate('guild/poll:USAGE')) }).then(m => m.timedDelete({ timeout: 5000 }));
            // Send poll to channel
            const embed = new Embed(bot, message.guild)
                .setTitle('guild/poll:TITLE', { USER: message.author.tag })
                .setDescription(message.args.join(' '))
                .setFooter({ text: message.guild.translate('guild/poll:FOOTER') });
            message.channel.send({ embeds: [embed] }).then((msg) => __awaiter(this, void 0, void 0, function* () {
                // Add reactions to message
                yield msg.react('✅');
                yield msg.react('❌');
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
            const text = args.get('poll').value;
            // Send poll to channel
            const embed = new Embed(bot, guild)
                .setTitle('guild/poll:TITLE', { USER: interaction.user.tag })
                .setDescription(text)
                .setFooter({ text: guild.translate('guild/poll:FOOTER') });
            interaction.reply({ embeds: [embed], fetchReply: true }).then((msg) => __awaiter(this, void 0, void 0, function* () {
                // Add reactions to message
                yield msg.react('✅');
                yield msg.react('❌');
            }));
        });
    }
}
module.exports = Poll;
