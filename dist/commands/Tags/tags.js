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
const { PermissionsBitField: { Flags } } = require('discord.js'), Command = require('../../structures/Command.js');
/**
 * Tags command
 * @extends {Command}
*/
class Tags extends Command {
    /**
     * @param {Client} client The instantiating client
     * @param {CommandData} data The data for the command
    */
    constructor(bot) {
        super(bot, {
            name: 'tags',
            guildOnly: true,
            dirname: __dirname,
            aliases: ['modifytags', 'tag'],
            userPermissions: [Flags.ManageGuild],
            botPermissions: [Flags.SendMessages, Flags.EmbedLinks],
            description: 'Edit server\'s tags',
            usage: 'tag <add/del/edit/view> <required paramters>',
            cooldown: 5000,
            examples: ['tag add java Download Java here: <https://adoptopenjdk.net/>', 'tag rename java Java'],
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
            // make sure something was entered
            if (!message.args[0])
                return message.channel.error('misc:INCORRECT_FORMAT', { EXAMPLE: settings.prefix.concat(message.translate('tags/tags:USAGE')) });
            // run subcommands
            const option = message.args[0].toLowerCase();
            message.args.shift();
            switch (option) {
                case 'add':
                    yield bot.commands.get('tag-add').run(bot, message, settings);
                    break;
                case 'delete':
                case 'del':
                    yield bot.commands.get('tag-delete').run(bot, message, settings);
                    break;
                case 'edit':
                    yield bot.commands.get('tag-edit').run(bot, message, settings);
                    break;
                case 'view':
                    yield bot.commands.get('tag-view').run(bot, message, settings);
                    break;
                default:
                    // delete message
                    return message.channel.error('misc:INCORRECT_FORMAT', { EXAMPLE: settings.prefix.concat(message.translate('tags/tags:USAGE')) });
            }
        });
    }
}
module.exports = Tags;
