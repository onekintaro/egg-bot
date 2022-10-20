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
const Puppeteer = require('puppeteer'), { AttachmentBuilder, ApplicationCommandOptionType, PermissionsBitField: { Flags } } = require('discord.js'), validUrl = require('valid-url'), Command = require('../../structures/Command.js');
/**
 * Screenshot command
 * @extends {Command}
*/
class Screenshot extends Command {
    /**
     * @param {Client} client The instantiating client
     * @param {CommandData} data The data for the command
    */
    constructor(bot) {
        super(bot, {
            name: 'screenshot',
            dirname: __dirname,
            aliases: ['ss'],
            botPermissions: [Flags.SendMessages, Flags.EmbedLinks, Flags.AttachFiles],
            description: 'Get a screenshot of a website.',
            usage: 'screenshot <url>',
            cooldown: 5000,
            examples: ['screenshot https://www.google.com/'],
            slash: true,
            options: [{
                    name: 'url',
                    description: 'url of website to screenshot.',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                }],
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
            // make sure a website was entered
            if (!message.args[0]) {
                if (message.deletable)
                    message.delete();
                return message.channel.error('misc:INCORRECT_FORMAT', { EXAMPLE: settings.prefix.concat(message.translate('fun/screenshot:USAGE')) });
            }
            // make sure URl is valid
            if (!validUrl.isUri(message.args[0])) {
                if (message.deletable)
                    message.delete();
                return message.channel.error('fun/screenshot:INVALID_URL');
            }
            // Make sure website is not NSFW in a non-NSFW channel
            if (!bot.adultSiteList.includes(require('url').parse(message.args[0]).host) && !message.channel.nsfw && message.guild) {
                if (message.deletable)
                    message.delete();
                return message.channel.error('fun/screenshot:BLACKLIST_WEBSITE');
            }
            // send 'waiting' message to show bot has recieved message
            const msg = yield message.channel.send(message.translate('misc:FETCHING', {
                EMOJI: message.channel.checkPerm('USE_EXTERNAL_EMOJIS') ? bot.customEmojis['loading'] : '', ITEM: this.help.name
            }));
            // make screenshot
            const data = yield this.fetchScreenshot(bot, message.args[0]);
            if (!data) {
                return message.channel.error('misc:ERROR_MESSAGE', { ERROR: 'Failed to fetch screenshot' });
            }
            else {
                const attachment = new AttachmentBuilder(data, { name: 'website.png' });
                yield message.channel.send({ files: [attachment] });
            }
            msg.delete();
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
            const channel = guild.channels.cache.get(interaction.channelId), url = args.get('url').value;
            // make sure URl is valid
            if (!validUrl.isUri(url))
                return interaction.reply({ embeds: [channel.error('fun/screenshot:INVALID_URL', {}, true)], ephermal: true });
            // Make sure website is not NSFW in a non-NSFW channel
            if (!bot.adultSiteList.includes(require('url').parse(url).host) && !channel.nsfw)
                return interaction.reply({ embeds: [channel.error('fun/screenshot:BLACKLIST_WEBSITE', {}, true)], ephermal: true });
            // display phrases' definition
            yield interaction.deferReply();
            const data = yield this.fetchScreenshot(bot, url);
            if (!data) {
                interaction.editReply({ embeds: [channel.error('misc:ERROR_MESSAGE', { ERROR: 'Failed to fetch screenshot' }, true)] });
            }
            else {
                const attachment = new AttachmentBuilder(data, { name: 'website.png' });
                interaction.editReply({ files: [attachment] });
            }
        });
    }
    reply(bot, interaction, channel, message) {
        return __awaiter(this, void 0, void 0, function* () {
            const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g;
            if (!message.content.match(urlRegex))
                return interaction.reply({ embeds: [channel.error('That is not a website', {}, true)], ephermal: true });
            const url = message.content.match(urlRegex)[0];
            // make sure URl is valid
            if (!validUrl.isUri(url)) {
                return interaction.reply({ embeds: [channel.error('fun/screenshot:INVALID_URL', {}, true)], ephermal: true });
            }
            // Make sure website is not NSFW in a non-NSFW channel
            if (!bot.adultSiteList.includes(require('url').parse(url).host) && !channel.nsfw)
                return interaction.reply({ embeds: [channel.error('fun/screenshot:BLACKLIST_WEBSITE', {}, true)], ephermal: true });
            // display phrases' definition
            yield interaction.deferReply();
            const data = yield this.fetchScreenshot(bot, url);
            if (!data) {
                interaction.editReply({ embeds: [channel.error('misc:ERROR_MESSAGE', { ERROR: 'Failed to fetch screenshot' }, true)] });
            }
            else {
                const attachment = new AttachmentBuilder(data, { name: 'website.png' });
                interaction.editReply({ files: [attachment] });
            }
        });
    }
    /**
     * Function for creating the screenshot of the URL.
     * @param {bot} bot The instantiating client
     * @param {string} URL The URL to screenshot from
     * @returns {embed}
    */
    fetchScreenshot(bot, URL) {
        return __awaiter(this, void 0, void 0, function* () {
            // try and create screenshot
            let data;
            try {
                const browser = yield Puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
                const page = yield browser.newPage();
                yield page.setViewport({ width: 1280, height: 720 });
                yield page.goto(URL);
                yield bot.delay(1500);
                data = yield page.screenshot();
                yield browser.close();
            }
            catch (err) {
                bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
            }
            return data;
        });
    }
}
module.exports = Screenshot;
