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
const { TagsSchema } = require('../../database/models/index.js'), { PermissionsBitField: { Flags } } = require('discord.js'), Command = require('../../structures/Command.js');
/**
 * Tag edit command
 * @extends {Command}
*/
class TagEdit extends Command {
    /**
     * @param {Client} client The instantiating client
     * @param {CommandData} data The data for the command
    */
    constructor(bot) {
        super(bot, {
            name: 'tag-edit',
            guildOnly: true,
            dirname: __dirname,
            aliases: ['t-edit'],
            userPermissions: [Flags.ManageGuild],
            botPermissions: [Flags.SendMessages, Flags.EmbedLinks],
            description: 'Edit a tag from this server',
            usage: 'tag-edit <rename / edit> <name> <newName / newResponse>',
            cooldown: 2000,
            examples: ['tag-edit rename java Java', 'tag-edit edit java Java is cool'],
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
            // delete message
            if (settings.ModerationClearToggle && message.deletable)
                message.delete();
            // make sure something was entered
            if (!message.args[0])
                return message.channel.error('misc:INCORRECT_FORMAT', { EXAMPLE: settings.prefix.concat(message.translate('tags/tag-edit:USAGE')) });
            // Get user options
            let responseString;
            if (message.args[0].toLowerCase() == 'rename') {
                // edit the tag with the new name
                responseString = message.args.slice(2).join(' ');
                if (!message.args[1])
                    return message.channel.error('tags/tag-edit:INVALID_NAME');
                if (!message.args[2])
                    return message.channel.error('tags/tag-edit:INVALID_NEW_NAME');
                try {
                    yield TagsSchema.findOneAndUpdate({ guildID: message.guild.id, name: message.args[1] }, { name: message.args[2] }).then(() => {
                        message.channel.success('tags/tag-edit:UPDATED_NAME', { NAME: message.args[2] });
                        message.guild.guildTags.splice(message.guild.guildTags.indexOf(message.args[1]), 1);
                        message.guild.guildTags.push(message.args[2]);
                    });
                }
                catch (err) {
                    bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
                    message.channel.error('misc:ERROR_MESSAGE', { ERROR: err.message });
                }
            }
            else if (message.args[0].toLowerCase() == 'edit') {
                // edit the tag with the new response
                responseString = message.args.slice(2).join(' ');
                if (!message.args[1])
                    return message.channel.error('tags/tag-edit:INVALID_NAME');
                if (!responseString)
                    return message.channel.error('tags/tag-edit:INVALID_NEW_RESP');
                try {
                    yield TagsSchema.findOneAndUpdate({ guildID: message.guild.id, name: message.args[1] }, { response: responseString }).then(() => {
                        message.channel.success('tags/tag-edit:UPDATED_RESP', { NAME: message.args[2] });
                    });
                }
                catch (err) {
                    bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
                    message.channel.error('misc:ERROR_MESSAGE', { ERROR: err.message });
                }
            }
            else {
                return message.channel.error('misc:INCORRECT_FORMAT', { EXAMPLE: settings.prefix.concat(message.translate('tags/tag-edit:USAGE')) });
            }
        });
    }
}
module.exports = TagEdit;
