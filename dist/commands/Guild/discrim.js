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
 * Discrim command
 * @extends {Command}
*/
class Discrim extends Command {
    /**
   * @param {Client} client The instantiating client
   * @param {CommandData} data The data for the command
  */
    constructor(bot) {
        super(bot, {
            name: 'discrim',
            guildOnly: true,
            dirname: __dirname,
            aliases: ['discriminator'],
            botPermissions: [Flags.SendMessages, Flags.EmbedLinks],
            description: 'Discrim',
            usage: 'discrim [discriminator]',
            cooldown: 2000,
            examples: ['discrim 6686'],
            slash: true,
            options: [{
                    name: 'discrim',
                    description: 'The discriminator you want to search for.',
                    type: ApplicationCommandOptionType.Integer,
                    required: false,
                }],
        });
    }
    /**
     * Function for receiving message.
     * @param {bot} bot The instantiating client
     * @param {message} message The message that ran the command
     * @readonly
    */
    run(bot, message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            // Make sure a discriminator was entered
            const discrim = (_a = message.args[0]) !== null && _a !== void 0 ? _a : message.author.discriminator;
            // Get all members with the entered discriminator
            const members = message.guild.members.cache.filter(m => m.user.discriminator == discrim).map(m => m);
            const embed = new Embed(bot, message.guild)
                .setTitle('guild/discrim:TITLE', { DISCRIM: message.args[0] })
                .setDescription(members.join(' '));
            message.channel.send({ embeds: [embed] });
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
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const discrim = (_b = (_a = args.get('discrim')) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : guild.members.cache.get(interaction.user.id).user.discriminator;
            // Get all members with the entered discriminator
            const members = guild.members.cache.filter(m => m.user.discriminator == discrim).map(m => m);
            const embed = new Embed(bot, guild)
                .setTitle('guild/discrim:TITLE', { DISCRIM: discrim })
                .setDescription(`${members}`);
            interaction.reply({ embeds: [embed] });
        });
    }
}
module.exports = Discrim;
