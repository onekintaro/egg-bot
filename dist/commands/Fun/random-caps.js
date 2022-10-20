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
 * Flip command
 * @extends {Command}
*/
class RandomCaps extends Command {
    /**
     * @param {Client} client The instantiating client
     * @param {CommandData} data The data for the command
    */
    constructor(bot) {
        super(bot, {
            name: 'random-caps',
            dirname: __dirname,
            botPermissions: [Flags.SendMessages, Flags.EmbedLinks],
            description: 'Generate a random caps',
            usage: 'random-caps <string>',
            cooldown: 1000,
            slash: true,
            options: [{
                    name: 'text',
                    description: 'Text for random caps',
                    type: ApplicationCommandOptionType.String,
                    maxLength: 2000,
                    required: true,
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
        return __awaiter(this, void 0, void 0, function* () {
            const text = message.args.join(' '), rndCaps = text.toLowerCase().split('').map(c => Math.random() < 0.5 ? c : c.toUpperCase()).join('');
            message.channel.send({ content: rndCaps });
        });
    }
    /**
     * Function for receiving interaction.
     * @param {bot} bot The instantiating client
     * @param {interaction} interaction The interaction that ran the command
     * @param {guild} guild The guild the interaction ran in
     * @readonly
    */
    callback(bot, interaction, guild, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const text = args.get('text').value, rndCaps = text.toLowerCase().split('').map(c => Math.random() < 0.5 ? c : c.toUpperCase()).join('');
            // send result
            return interaction.reply({ content: rndCaps });
        });
    }
}
module.exports = RandomCaps;
