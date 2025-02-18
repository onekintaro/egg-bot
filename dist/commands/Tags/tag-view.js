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
const { Embed } = require('../../utils'), { TagsSchema } = require('../../database/models/index.js'), { PermissionsBitField: { Flags } } = require('discord.js'), Command = require('../../structures/Command.js');
/**
 * Tag view command
 * @extends {Command}
*/
class TagView extends Command {
    /**
     * @param {Client} client The instantiating client
     * @param {CommandData} data The data for the command
    */
    constructor(bot) {
        super(bot, {
            name: 'tag-view',
            guildOnly: true,
            dirname: __dirname,
            aliases: ['t-view'],
            userPermissions: [Flags.ManageGuild],
            botPermissions: [Flags.SendMessages, Flags.EmbedLinks],
            description: 'View the server\'s tag(s)',
            usage: 'tag-view [name]',
            cooldown: 2000,
            examples: ['tag-view'],
        });
    }
    /**
     * Function for receiving message.
     * @param {bot} bot The instantiating client
     * @param {message} message The message that ran the command
     * @param {settings} settings The settings of the channel the command ran in
     * @readonly
    */
    run(bot, message) {
        return __awaiter(this, void 0, void 0, function* () {
            // view all tags on the server
            try {
                const tags = yield TagsSchema.find({ guildID: message.guild.id });
                // if no tags have been saved yet
                if (!tags[0])
                    return message.channel.error('tags/tag-view:NO_TAG');
                // check if an input was entered
                if (message.args[0]) {
                    const tag = tags.find(t => t.name == message.args[0]);
                    if (tag)
                        return message.channel.send(tag.response);
                }
                // if no input was entered or tagName didn't match
                if (tags != null) {
                    const resultEmbed = new Embed(bot, message.guild)
                        .setTitle('tags/tag-view:TITLE', { NAME: message.guild.name });
                    tags.forEach(value => {
                        resultEmbed.addFields({ name: message.translate('tags/tag-view:TITLE', { NAME: value.name }), value: message.translate('tags/tag-view:RESP', { RESP: value.response }) });
                    });
                    return message.channel.send({ embeds: [resultEmbed] });
                }
                else {
                    return message.channel.error('tags/tag-view:NO_EXIST');
                }
            }
            catch (err) {
                bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
                message.channel.error('misc:ERROR_MESSAGE', { ERROR: err.message });
            }
        });
    }
}
module.exports = TagView;
