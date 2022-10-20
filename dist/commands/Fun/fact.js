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
const fs = require('fs'), { Embed } = require('../../utils'), { PermissionsBitField: { Flags } } = require('discord.js'), Command = require('../../structures/Command.js');
/**
 * Fact command
 * @extends {Command}
*/
class Fact extends Command {
    /**
     * @param {Client} client The instantiating client
     * @param {CommandData} data The data for the command
    */
    constructor(bot) {
        super(bot, {
            name: 'fact',
            dirname: __dirname,
            aliases: ['facts'],
            botPermissions: [Flags.SendMessages, Flags.EmbedLinks],
            description: 'Receive a random Pokémon fact.',
            usage: 'fact',
            slash: true,
            cooldown: 1000,
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
            // Get the random facts file
            fs.readFile('./src/assets/json/random-pokemon-facts.json', (err, data) => {
                if (err) {
                    if (message.deletable)
                        message.delete();
                    bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
                    return message.channel.error('misc:ERROR_MESSAGE', { ERROR: err.message });
                }
                // Retrieve a random fact
                const { facts } = JSON.parse(data);
                const num = Math.floor((Math.random() * facts.length));
                const embed = new Embed(bot, message.guild)
                    .setTitle('fun/fact:FACT_TITLE')
                    .setDescription(facts[num]);
                message.channel.send({ embeds: [embed] });
            });
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
            const channel = guild.channels.cache.get(interaction.channelId);
            fs.readFile('./src/assets/json/random-facts.json', (err, data) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
                    yield interaction.reply({ embeds: [channel.error('misc:ERROR_MESSAGE', { ERROR: err.message }, true)], ephemeral: true });
                }
                // Retrieve a random fact
                const { facts } = JSON.parse(data);
                const num = Math.floor((Math.random() * facts.length));
                const embed = new Embed(bot, guild)
                    .setTitle('fun/fact:FACT_TITLE')
                    .setDescription(facts[num]);
                yield interaction.reply({ embeds: [embed] });
            }));
        });
    }
}
module.exports = Fact;
