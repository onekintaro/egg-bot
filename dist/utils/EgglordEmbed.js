"use strict";
const { EmbedBuilder } = require('discord.js');
/**
 * EgglordEmbed
 * @extends {MessageEmbed}
*/
class EgglordEmbed extends EmbedBuilder {
    /**
     * @param {Client} client The instantiating client
     * @param {?guild} guild The guild of which the embed will be sent to
     * @param {CommandData} data The data of the embed
    */
    constructor(bot, guild, data = {}) {
        super(data);
        this.bot = bot;
        this.guild = guild;
        this.setColor(bot.config.embedColor)
            .setTimestamp();
    }
    // Language translator for title
    setTitle(key, args) {
        var _a, _b;
        const language = (_b = (_a = this.guild.settings) === null || _a === void 0 ? void 0 : _a.Language) !== null && _b !== void 0 ? _b : require('../assets/json/defaultGuildSettings.json').Language;
        this.data.title = this.bot.translate(key, args, language) ? this.bot.translate(key, args, language) : key;
        return this;
    }
}
module.exports = EgglordEmbed;
