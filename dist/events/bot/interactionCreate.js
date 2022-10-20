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
const Event = require('../../structures/Event');
/**
 * Interaction create event
 * @event Egglord#InteractionCreate
 * @extends {Event}
*/
class InteractionCreate extends Event {
    constructor(...args) {
        super(...args, {
            dirname: __dirname,
        });
    }
    /**
     * Function for receiving event.
     * @param {bot} bot The instantiating client
     * @param {Interaction} interaction The interaction recieved (slash, button, context menu & select menu etc)
     * @readonly
    */
    run(bot, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if it's message context menu
            if (interaction.isMessageContextMenuCommand() || interaction.isUserContextMenuCommand())
                return bot.emit('clickMenu', interaction);
            // Check if it's autocomplete
            if (interaction.isAutocomplete())
                return bot.emit('autoComplete', interaction);
            // Check if it's a button
            if (interaction.isButton())
                return bot.emit('clickButton', interaction);
            // Check if it's a slash command
            if (interaction.isCommand())
                return bot.emit('slashCreate', interaction);
        });
    }
}
module.exports = InteractionCreate;
