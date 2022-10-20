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
const { Embed } = require('../../utils'), Event = require('../../structures/Event');
/**
 * Role create event
 * @event Egglord#RoleCreate
 * @extends {Event}
*/
class RoleCreate extends Event {
    constructor(...args) {
        super(...args, {
            dirname: __dirname,
        });
    }
    /**
     * Function for receiving event.
     * @param {bot} bot The instantiating client
     * @param {Role} role The role that was created
     * @readonly
    */
    run(bot, role) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            // For debugging
            if (bot.config.debug)
                bot.logger.debug(`Role: ${role.name} has been created in guild: ${role.guild.id}.`);
            // Get server settings / if no settings then return
            const settings = role.guild.settings;
            if (Object.keys(settings).length == 0)
                return;
            // Check if event roleCreate is for logging
            if (((_a = settings.ModLogEvents) === null || _a === void 0 ? void 0 : _a.includes('ROLECREATE')) && settings.ModLog) {
                const embed = new Embed(bot, role.guild)
                    .setDescription(`**Role: ${role} (${role.name}) was created**`)
                    .setColor(3066993)
                    .setFooter({ text: `ID: ${role.id}` })
                    .setAuthor({ name: role.guild.name, iconURL: role.guild.iconURL() })
                    .setTimestamp();
                // Find channel and send message
                try {
                    const modChannel = yield bot.channels.fetch(settings.ModLogChannel).catch(() => bot.logger.error(`Error fetching guild: ${role.guild.id} logging channel`));
                    if (modChannel && modChannel.guild.id == role.guild.id)
                        bot.addEmbed(modChannel.id, [embed]);
                }
                catch (err) {
                    bot.logger.error(`Event: '${this.conf.name}' has error: ${err.message}.`);
                }
            }
        });
    }
}
module.exports = RoleCreate;
