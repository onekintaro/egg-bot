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
 * Tag delete command
 * @extends {Command}
*/
class TagDelete extends Command {
    /**
     * @param {Client} client The instantiating client
     * @param {CommandData} data The data for the command
    */
    constructor(bot) {
        super(bot, {
            name: 'tag-delete',
            guildOnly: true,
            dirname: __dirname,
            aliases: ['t-delete', 't-remove', 'tag-del'],
            userPermissions: [Flags.ManageGuild],
            botPermissions: [Flags.SendMessages, Flags.EmbedLinks],
            description: 'Remove a tag from the server',
            usage: 'tag-delete <name>',
            cooldown: 2000,
            examples: ['tag-delete java'],
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
                return message.channel.error('misc:INCORRECT_FORMAT', { EXAMPLE: settings.prefix.concat(message.translate('tags/tag-delete:USAGE')) });
            // try and delete tag
            try {
                const result = yield TagsSchema.findOneAndRemove({ guildID: message.guild.id, name: message.args[0] });
                if (result) {
                    message.channel.success('tags/tag-delete:TAG_DELETED', { TAG: message.args[0] });
                    message.guild.guildTags.splice(message.guild.guildTags.indexOf(message.args[0]), 1);
                }
                else {
                    message.channel.error('tags/tag-delete:NO_TAG', { TAG: message.args[0] });
                }
            }
            catch (err) {
                bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
                message.channel.error('misc:ERROR_MESSAGE', { ERROR: err.message });
            }
        });
    }
}
module.exports = TagDelete;
