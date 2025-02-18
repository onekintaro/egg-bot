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
const { ApplicationCommandOptionType, PermissionsBitField: { Flags } } = require('discord.js'), Command = require('../../structures/Command.js');
/**
 * Giveaway start command
 * @extends {Command}
*/
class Giveaway extends Command {
    /**
   * @param {Client} client The instantiating client
   * @param {CommandData} data The data for the command
  */
    constructor(bot) {
        super(bot, {
            name: 'giveaway',
            guildOnly: true,
            dirname: __dirname,
            userPermissions: [Flags.ManageGuild],
            botPermissions: [Flags.SendMessages, Flags.EmbedLinks, Flags.AddReactions],
            description: 'Interact with the giveaway commands',
            usage: 'giveaway start <time> <Number of winners> <prize>',
            cooldown: 30000,
            examples: ['giveaway start 1m 1 nitro', 'giveaway reroll 1021725995901911080'],
            slash: true,
            options: bot.commands.filter(c => c.help.category == 'Giveaway' && c.help.name !== 'giveaway').map(c => ({
                name: c.help.name.replace('g-', ''),
                description: c.help.description,
                type: ApplicationCommandOptionType.Subcommand,
                options: c.conf.options,
            })),
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
            const command = bot.commands.get(`g-${interaction.options.getSubcommand()}`);
            if (command) {
                command.callback(bot, interaction, guild, args);
            }
            else {
                interaction.reply({ content: 'Error' });
            }
        });
    }
}
module.exports = Giveaway;
