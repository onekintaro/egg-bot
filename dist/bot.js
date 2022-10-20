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
const Client = require('./base/Egglord.js');
require('./structures');
const bot = new Client(), { promisify } = require('util'), readdir = promisify(require('fs').readdir), path = require('path');
// Load commands
(() => __awaiter(void 0, void 0, void 0, function* () {
    // load commands
    yield loadCommands();
    // load events
    yield loadEvents();
    // load translations
    bot.translations = yield require('./helpers/LanguageManager')();
    // Connect bot to database
    bot.mongoose.init(bot);
    // load up adult site block list
    bot.fetchAdultSiteList();
    // Connect bot to discord API
    const token = bot.config.token;
    bot.login(token).catch(e => bot.logger.error(e.message));
}))();
// load commands
function loadCommands() {
    return __awaiter(this, void 0, void 0, function* () {
        const cmdFolders = (yield readdir('./src/commands/')).filter((v, i, a) => a.indexOf(v) === i);
        bot.logger.log('=-=-=-=-=-=-=- Loading command(s): 137 -=-=-=-=-=-=-=');
        // loop through each category
        cmdFolders.forEach((dir) => __awaiter(this, void 0, void 0, function* () {
            if (bot.config.disabledPlugins.includes(dir) || dir == 'command.example.js')
                return;
            const commands = (yield readdir('./src/commands/' + dir + '/')).filter((v, i, a) => a.indexOf(v) === i);
            // loop through each command in the category
            commands.forEach((cmd) => {
                if (bot.config.disabledCommands.includes(cmd.replace('.js', '')))
                    return;
                try {
                    bot.loadCommand('./commands/' + dir, cmd);
                }
                catch (err) {
                    if (bot.config.debug)
                        console.log(err);
                    bot.logger.error(`Unable to load command ${cmd}: ${err}`);
                }
            });
        }));
    });
}
// load events
function loadEvents() {
    return __awaiter(this, void 0, void 0, function* () {
        const evtFolder = yield readdir('./src/events/');
        bot.logger.log('=-=-=-=-=-=-=- Loading events(s): 44 -=-=-=-=-=-=-=');
        evtFolder.forEach((folder) => __awaiter(this, void 0, void 0, function* () {
            const folders = yield readdir('./src/events/' + folder + '/');
            folders.forEach((file) => __awaiter(this, void 0, void 0, function* () {
                delete require.cache[file];
                const { name } = path.parse(file);
                try {
                    const event = new (require(`./events/${folder}/${file}`))(bot, name);
                    bot.logger.log(`Loading Event: ${name}`);
                    // Make sure the right manager gets the event
                    if (event.conf.child) {
                        bot[event.conf.child].on(name, (...args) => event.run(bot, ...args));
                    }
                    else {
                        bot.on(name, (...args) => event.run(bot, ...args));
                    }
                }
                catch (err) {
                    bot.logger.error(`Failed to load Event: ${name} error: ${err.message}`);
                }
            }));
        }));
    });
}
// handle unhandledRejection errors
process.on('unhandledRejection', err => {
    bot.logger.error(`Unhandled promise rejection: ${err.message}.`);
    // show full error if debug mode is on
    console.log(err);
});
