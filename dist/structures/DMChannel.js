"use strict";
// Dependecies
const { EmbedBuilder, DMChannel } = require('discord.js');
module.exports = Object.defineProperties(DMChannel.prototype, {
    // Send custom 'error' message
    error: {
        value: function (key, args, returnValue) {
            var _a;
            try {
                const emoji = this.client.customEmojis['cross'];
                const embed = new EmbedBuilder()
                    .setColor(15158332)
                    .setDescription(`${emoji} ${(_a = this.client.translate(key, args, require('../assets/json/defaultGuildSettings.json').Language)) !== null && _a !== void 0 ? _a : key}`);
                return returnValue ? embed : this.send({ embeds: [embed] });
            }
            catch (err) {
                this.client.logger.error(err.message);
            }
        },
    },
    // Send custom 'success' message
    success: {
        value: function (key, args, returnValue) {
            var _a;
            try {
                const emoji = this.client.customEmojis['checkmark'];
                const embed = new EmbedBuilder()
                    .setColor(3066993)
                    .setDescription(`${emoji} ${(_a = this.client.translate(key, args, require('../assets/json/defaultGuildSettings.json').Language)) !== null && _a !== void 0 ? _a : key}`);
                return returnValue ? embed : this.send({ embeds: [embed] });
            }
            catch (err) {
                this.client.logger.error(err.message);
            }
        },
    },
    // Check if bot has permission to send custom emoji
    checkPerm: {
        value: function () {
            return true;
        },
    },
});
