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
const Command = require('../../structures/Command.js'), { PermissionsBitField: { Flags } } = require('discord.js'), { ReactionRoleSchema } = require('../../database/models');
/**
 * Reaction role remove command
 * @extends {Command}
*/
class ReactionRoleRemove extends Command {
    /**
     * @param {Client} client The instantiating client
     * @param {CommandData} data The data for the command
    */
    constructor(bot) {
        super(bot, {
            name: 'rr-remove',
            guildOnly: true,
            dirname: __dirname,
            aliases: ['reactionroles-remove', 'rr-delete'],
            userPermissions: [Flags.ManageGuild],
            botPermissions: [Flags.SendMessages, Flags.EmbedLinks],
            description: 'Make reaction roles',
            usage: 'reactionroles <messagelink>',
            cooldown: 5000,
            examples: ['reactionroles https://discord.com/channels/750822670505082971/761619652009787392/837657228055937054'],
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
            // Delete message
            if (settings.ModerationClearToggle && message.deletable)
                message.delete();
            // make sure an arg was sent aswell
            if (!message.args[0])
                return message.channel.error('misc:INCORRECT_FORMAT', { EXAMPLE: settings.prefix.concat(message.translate('plugins/rr-remove:USAGE')) });
            // fetch and validate message
            const patt = /https?:\/\/(?:(?:canary|ptb|www)\.)?discord(?:app)?\.com\/channels\/(?:@me|(?<g>\d+))\/(?<c>\d+)\/(?<m>\d+)/g;
            let msg;
            if (patt.test(message.args[0])) {
                const stuff = message.args[0].split('/');
                try {
                    msg = yield ((_b = (_a = bot.guilds.cache.get(stuff[4])) === null || _a === void 0 ? void 0 : _a.channels.cache.get(stuff[5])) === null || _b === void 0 ? void 0 : _b.messages.fetch(stuff[6]));
                }
                catch (err) {
                    if (message.deletable)
                        message.delete();
                    bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
                    return message.channel.error('misc:ERROR_MESSAGE', { ERROR: err.message });
                }
            }
            else {
                return message.channel.send(message.translate('plugins/rr-add:INVALID'));
            }
            // delete message and then remove database
            try {
                yield msg.delete();
                yield ReactionRoleSchema.findOneAndRemove({ messageID: msg.id, channelID: msg.channel.id });
                message.channel.send(message.translate('plugins/rr-remove:SUCCESS'));
            }
            catch (err) {
                if (message.deletable)
                    message.delete();
                bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
                return message.channel.error('misc:ERROR_MESSAGE', { ERROR: err.message });
            }
        });
    }
}
module.exports = ReactionRoleRemove;
