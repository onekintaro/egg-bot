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
const { Embed } = require('../../utils'), { ActionRowBuilder, ButtonBuilder, ButtonStyle, ApplicationCommandOptionType, PermissionsBitField: { Flags } } = require('discord.js'), Command = require('../../structures/Command.js');
/**
 * Clear command
 * @extends {Command}
*/
class Clear extends Command {
    /**
     * @param {Client} client The instantiating client
     * @param {CommandData} data The data for the command
    */
    constructor(bot) {
        super(bot, {
            name: 'clear',
            guildOnly: true,
            dirname: __dirname,
            aliases: ['cl', 'purge'],
            userPermissions: [Flags.ManageMessages],
            botPermissions: [Flags.SendMessages, Flags.EmbedLinks, Flags.ReadMessageHistory, Flags.ManageMessages],
            description: 'Clear a certain amount of messages.',
            usage: 'clear <Number> [member]',
            cooldown: 5000,
            examples: ['clear 50 username', 'clear 10'],
            slash: false,
            options: [
                {
                    name: 'number',
                    description: 'The number of messages to delete.',
                    type: ApplicationCommandOptionType.Integer,
                    minValue: 1,
                    maxValue: 1000,
                    required: true,
                },
                {
                    name: 'user',
                    description: 'Only delete messages from this user.',
                    type: ApplicationCommandOptionType.User,
                    required: false,
                },
                {
                    name: 'flag',
                    description: 'Show how many messages were deleted.',
                    type: ApplicationCommandOptionType.String,
                    choices: ['-show'].map(i => ({ name: i, value: i })),
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
            // Get number of messages to removed
            const amount = message.args[0];
            // Make something was entered after `!clear`
            if (!amount)
                return message.channel.error('misc:INCORRECT_FORMAT', { EXAMPLE: settings.prefix.concat(message.translate('moderation/clear:USAGE')) });
            // Make sure x is a number
            if (isNaN(amount) || (amount > 1000) || (amount < 1))
                return message.channel.error('misc:INCORRECT_FORMAT', { EXAMPLE: settings.prefix.concat(message.translate('moderation/clear:USAGE')) });
            // make sure guild is premium if amount > 200
            if (amount > 200 && !message.guild.premium)
                return message.channel.error('moderation/clear:NO_PREM');
            // Confirmation for message deletion over 100
            if (amount >= 100) {
                const embed = new Embed(bot, message.guild)
                    .setTitle(message.translate('moderation/clear:TITLE'))
                    .setDescription(message.translate('moderation/clear:DESC', { NUM: amount }));
                // create the buttons
                const row = new ActionRowBuilder()
                    .addComponents(new ButtonBuilder()
                    .setCustomId('success')
                    .setLabel('Confirm')
                    .setStyle(ButtonStyle.Success)
                    .setEmoji(message.channel.checkPerm('USE_EXTERNAL_EMOJIS') ? bot.customEmojis['checkmark'] : '✅'))
                    .addComponents(new ButtonBuilder()
                    .setCustomId('cancel')
                    .setLabel('Cancel')
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji(message.channel.checkPerm('USE_EXTERNAL_EMOJIS') ? bot.customEmojis['cross'] : '❌'));
                // Send confirmation message
                yield message.channel.send({ embeds: [embed], components: [row] }).then((msg) => __awaiter(this, void 0, void 0, function* () {
                    // create collector
                    const filter = (i) => ['cancel', 'success'].includes(i.customId) && i.user.id === message.author.id;
                    const collector = msg.createMessageComponentCollector({ filter, time: 15000 });
                    // A button was clicked
                    collector.on('collect', (i) => __awaiter(this, void 0, void 0, function* () {
                        // User pressed cancel button
                        if (i.customId === 'cancel') {
                            embed.setDescription(message.translate('moderation/clear:CON_CNC'));
                            return msg.edit({ embeds: [embed], components: [] });
                        }
                        else {
                            // Delete the messages
                            yield i.reply(message.translate('moderation/clear:DEL_MSG', { TIME: Math.ceil(amount / 100) * 5, NUM: amount }));
                            yield bot.delay(5000);
                            let x = 0, y = 0;
                            const z = amount;
                            while (x !== Math.ceil(amount / 100)) {
                                try {
                                    let messages = yield message.channel.messages.fetch({ limit: z > 100 ? 100 : z });
                                    // Delete user messages
                                    if (message.args[1]) {
                                        const member = yield message.getMember();
                                        messages = messages.filter((m) => m.author.id == member[0].user.id);
                                    }
                                    // delete the message
                                    const delMessages = yield message.channel.bulkDelete(messages, true).catch(err => bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`));
                                    y += delMessages.size;
                                    x++;
                                    yield bot.delay(5000);
                                }
                                catch (e) {
                                    x = Math.ceil(amount / 100);
                                }
                            }
                            return message.channel.success('moderation/clear:SUCCESS', { NUM: y }).then(m => m.timedDelete({ timeout: 3000 }));
                        }
                    }));
                    // user did not react in time
                    collector.on('end', () => __awaiter(this, void 0, void 0, function* () {
                        if (msg.deleted)
                            return;
                        if (embed.description == message.translate('moderation/clear:CON_CNC')) {
                            yield msg.delete();
                        }
                        else {
                            embed.setDescription(message.translate('moderation/clear:CON_TO'));
                            yield msg.edit({ embeds: [embed], components: [] });
                        }
                    }));
                }));
            }
            else {
                // Delete messages (less than 100)
                yield message.channel.messages.fetch({ limit: amount }).then((messages) => __awaiter(this, void 0, void 0, function* () {
                    // Delete user messages
                    if (message.args[1]) {
                        const member = yield message.getMember();
                        messages = messages.filter((m) => m.author.id == member[0].user.id);
                    }
                    // delete the message
                    yield message.channel.bulkDelete(messages, true).catch(err => bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`));
                    message.channel.success('moderation/clear:SUCCESS', { NUM: messages.size }).then(m => m.timedDelete({ timeout: 3000 }));
                }));
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
        return __awaiter(this, void 0, void 0, function* () {
            const member = guild.members.cache.get(args.get('user')), channel = guild.channels.cache.get(interaction.channelId), amount = args.get('amount').value;
            // make sure guild is premium if amount > 200
            if (amount > 200 && !guild.premium)
                return interaction.reply({ embeds: [channel.error('moderation/clear:NO_PREM', null, true)] });
            // Confirmation for message deletion over 100
            if (amount >= 100) {
                const embed = new Embed(bot, guild)
                    .setTitle(guild.translate('moderation/clear:TITLE'))
                    .setDescription(guild.translate('moderation/clear:DESC', { NUM: amount }));
                // create the buttons
                const row = new ActionRowBuilder()
                    .addComponents(new ButtonBuilder()
                    .setCustomId('success')
                    .setLabel('Confirm')
                    .setStyle(ButtonStyle.Success)
                    .setEmoji(channel.checkPerm('USE_EXTERNAL_EMOJIS') ? bot.customEmojis['checkmark'] : '✅'))
                    .addComponents(new ButtonBuilder()
                    .setCustomId('cancel')
                    .setLabel('Cancel')
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji(channel.checkPerm('USE_EXTERNAL_EMOJIS') ? bot.customEmojis['cross'] : '❌'));
                // Send confirmation message
                yield interaction.reply({ embeds: [embed], components: [row], fetchReply: true }).then((msg) => __awaiter(this, void 0, void 0, function* () {
                    // create collector
                    const filter = (i) => ['cancel', 'success'].includes(i.customId) && i.user.id === interaction.user.id;
                    const collector = msg.createMessageComponentCollector({ filter, time: 15000 });
                    // A button was clicked
                    collector.on('collect', (i) => __awaiter(this, void 0, void 0, function* () {
                        // User pressed cancel button
                        if (i.customId === 'cancel') {
                            embed.setDescription(guild.translate('moderation/clear:CON_CNC'));
                            return msg.edit({ embeds: [embed], components: [] });
                        }
                        else {
                            // Delete the messages
                            yield i.reply(guild.translate('moderation/clear:DEL_MSG', { TIME: Math.ceil(amount / 100) * 5, NUM: amount }));
                            yield bot.delay(5000);
                            let x = 0, y = 0;
                            const z = amount;
                            while (x !== Math.ceil(amount / 100)) {
                                try {
                                    let messages = yield channel.messages.fetch({ limit: z > 100 ? 100 : z });
                                    // Delete user messages
                                    if (member) {
                                        messages = messages.filter((m) => m.author.id == member[0].user.id);
                                    }
                                    // delete the message
                                    const delMessages = yield channel.bulkDelete(messages, true).catch(err => bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`));
                                    y += delMessages.size;
                                    x++;
                                    yield bot.delay(5000);
                                }
                                catch (e) {
                                    x = Math.ceil(amount / 100);
                                }
                            }
                            return interaction.reply({ embeds: [channel.success('moderation/clear:SUCCESS', { NUM: y }, true)] });
                        }
                    }));
                    // user did not react in time
                    collector.on('end', () => __awaiter(this, void 0, void 0, function* () {
                        if (msg.deleted)
                            return;
                        if (embed.description == guild.translate('moderation/clear:CON_CNC')) {
                            yield msg.delete();
                        }
                        else {
                            embed.setDescription(guild.translate('moderation/clear:CON_TO'));
                            yield msg.edit({ embeds: [embed], components: [] });
                        }
                    }));
                }));
            }
            else {
                // Delete messages (less than 100)
                yield channel.messages.fetch({ limit: amount }).then((messages) => __awaiter(this, void 0, void 0, function* () {
                    // Delete user messages
                    if (member)
                        messages = messages.filter((m) => m.author.id == member[0].user.id);
                    // delete the message
                    yield channel.bulkDelete(messages, true).catch(err => bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`));
                    interaction.reply({ embeds: [channel.success('moderation/clear:SUCCESS', { NUM: messages.size }, true)] });
                }));
            }
        });
    }
}
module.exports = Clear;