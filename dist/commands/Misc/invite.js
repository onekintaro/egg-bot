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
const { EmbedBuilder, PermissionsBitField: { Flags } } = require('discord.js'), { functions: { genInviteLink } } = require('../../utils'), Command = require('../../structures/Command.js');
/**
 * Invite command
 * @extends {Command}
*/
class Invite extends Command {
    /**
     * @param {Client} client The instantiating client
     * @param {CommandData} data The data for the command
    */
    constructor(bot) {
        super(bot, {
            name: 'invite',
            dirname: __dirname,
            aliases: ['inv'],
            botPermissions: [Flags.SendMessages, Flags.EmbedLinks],
            description: 'Send an invite link so people can add me to their server.',
            usage: 'invite',
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
            const embed = new EmbedBuilder()
                .setDescription(message.translate('misc/invite:LINK', { LINK: genInviteLink(bot) }));
            message.channel.send({ embeds: [embed] });
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
            return interaction.reply({ embeds: [{ description: guild.translate('misc/invite:LINK', { LINK: genInviteLink(bot) }) }] });
        });
    }
}
module.exports = Invite;
