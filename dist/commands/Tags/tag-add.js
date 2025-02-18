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
 * Tag add command
 * @extends {Command}
*/
class TagAdd extends Command {
    /**
     * @param {Client} client The instantiating client
     * @param {CommandData} data The data for the command
    */
    constructor(bot) {
        super(bot, {
            name: 'tag-add',
            guildOnly: true,
            dirname: __dirname,
            aliases: ['t-add'],
            userPermissions: [Flags.ManageGuild],
            botPermissions: [Flags.SendMessages, Flags.EmbedLinks],
            description: 'Add a new tag to the server',
            usage: 'tag-add <name> <response>',
            cooldown: 2000,
            examples: ['tag-add java Download Java here: <https://adoptopenjdk.net/>'],
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
                return message.channel.error('misc:INCORRECT_FORMAT', { EXAMPLE: settings.prefix.concat(message.translate('tags/tag-add:USAGE')) });
            try {
                // Validate input
                const responseString = message.args.slice(1).join(' ');
                if (!message.args[0])
                    return message.channel.error('tags/tag-add:INVALID_NAME');
                if (!message.args[0].length > 10)
                    return message.channel.error('tags/tag-add:NAME_TOO_LONG');
                if (!responseString)
                    return message.channel.error('tags/tag-add:INVALID_RESP');
                // Make sure the tagName doesn't exist and they haven't gone past the tag limit
                TagsSchema.find({ guildID: message.guild.id }).then((guildTags) => __awaiter(this, void 0, void 0, function* () {
                    if (guildTags.length >= 10 && !message.guild.premium)
                        return message.channel.error('tags/tag-add:NEED_PREMIUM');
                    if (guildTags.length >= 50)
                        return message.channel.error('tags/tag-add:MAX_TAGS');
                    // Make sure the tagName doesn't exist
                    if (guildTags.find(t => t.name == message.args[0]))
                        return message.channel.serror('tags/tag-add:SAME_NAME');
                    // save tag as name doesn't exists
                    yield (new TagsSchema({
                        guildID: message.guild.id,
                        name: message.args[0],
                        response: responseString,
                    })).save();
                    message.channel.success('tags/tag-add:TAGS_SAVED', { TAG: message.args[0] });
                    message.guild.guildTags.push(message.args[0]);
                }));
            }
            catch (err) {
                bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
                message.channel.error('misc:ERROR_MESSAGE', { ERROR: err.message });
            }
        });
    }
}
module.exports = TagAdd;
