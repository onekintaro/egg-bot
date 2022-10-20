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
const { Message } = require('discord.js'), { findBestMatch } = require('string-similarity');
module.exports = Object.defineProperties(Message.prototype, {
    args: {
        value: [],
        writable: true,
    },
    // Fetch the args from a message
    getArgs: {
        value: function () {
            const args = this.content.split(/ +/);
            args.shift();
            if (this.content.startsWith(`<@!${this.client.user.id}>`))
                args.shift();
            // append it to message structure
            this.args = args;
            return args;
        },
    },
    // Get member(s) from message (via ID, mention or username)
    getMember: {
        value: function (fallback = true) {
            return __awaiter(this, void 0, void 0, function* () {
                const users = [];
                // add all mentioned users
                for (let i = 0; i < this.args.length; i++) {
                    // eslint-disable-next-line no-empty-function
                    if ([...this.mentions.users.values()][i] || (yield this.client.users.fetch(this.args[i]).catch(() => { }))) {
                        // eslint-disable-next-line no-empty-function
                        users.push([...this.mentions.users.values()][i] || (yield this.client.users.fetch(this.args[i]).catch(() => { })));
                    }
                }
                // find user
                if (this.args[0]) {
                    const members = [], indexes = [];
                    // Whether or not to get users from DM channel or guild
                    if (this.guild) {
                        // fetch all members before search
                        yield this.guild.members.fetch();
                        // search for members
                        this.guild.members.cache.forEach(member => {
                            members.push(member.user.username);
                            indexes.push(member.id);
                        });
                    }
                    else {
                        members.push(this.author.username, this.client.user.username);
                        indexes.push(this.author.id, this.client.user.id);
                    }
                    const match = findBestMatch(this.args.join(' '), members);
                    if (match.bestMatch.rating >= 0.1) {
                        const username = match.bestMatch.target, member = this.client.users.cache.get(indexes[members.indexOf(username)]);
                        users.push(member);
                    }
                }
                // check if it should return the author as a fallback value
                if (fallback)
                    users.push(this.author);
                let items;
                if (this.guild) {
                    items = users.map(user => this.guild.members.cache.get(user.id)).filter(member => member !== undefined);
                }
                else {
                    items = users.map(user => Object.assign({ id: user.id }, { user: user }));
                }
                // add author at the end
                return items;
            });
        },
    },
    // Get channel(s) from message (via ID or mention)
    getChannel: {
        value: function () {
            const channels = [];
            // get all channels mentioned
            for (let i = 0; i < this.args.length; i++) {
                if ([...this.mentions.channels.values()][i] || this.guild.channels.cache.get(this.args[i])) {
                    channels.push([...this.mentions.channels.values()][i] || this.guild.channels.cache.get(this.args[i]));
                }
            }
            channels.push(this.channel);
            return channels;
        },
    },
    // Get role(s) from message (via ID, mention or name)
    getRole: {
        value: function () {
            const roles = [];
            // get all roles mentioned or ID
            for (let i = 0; i < this.args.length; i++) {
                if ([...this.mentions.roles.values()][i] || this.guild.roles.cache.get(this.args[i])) {
                    roles.push([...this.mentions.roles.values()][i] || this.guild.roles.cache.get(this.args[i]));
                }
            }
            // find role via name
            if (this.args[0]) {
                const roleList = [];
                this.guild.roles.cache.forEach(r => {
                    roleList.push(r.name);
                });
                if (roleList.length != this.args.length) {
                    const match = findBestMatch(this.args.join(' '), roleList);
                    if (match.bestMatch.rating != 0) {
                        const username = match.bestMatch.target, role = this.guild.roles.cache.find(r => r.name == username);
                        roles.push(role);
                    }
                }
            }
            // return the array of roles
            return roles;
        },
    },
    // Get image(s) from message (via file upload, message link, reply feature or this.getMember()'s avatar)
    getImage: {
        value: function () {
            var _a, _b;
            return __awaiter(this, void 0, void 0, function* () {
                const fileTypes = ['png', 'jpeg', 'tiff', 'jpg', 'webp'];
                // get image if there is one
                const file = [];
                // Check attachments
                if (this.attachments.size > 0) {
                    const url = this.attachments.first().url;
                    for (const type of fileTypes) {
                        if (url.toLowerCase().indexOf(type) !== -1)
                            file.push(url);
                    }
                    // no file with the correct format was found
                    if (file.length === 0)
                        return this.channel.error('misc:INVALID_FILE').then(m => m.timedDelete({ timeout: 10000 }));
                }
                // check for message link
                for (const value of this.args) {
                    const patt = /https?:\/\/(?:(?:canary|ptb|www)\.)?discord(?:app)?\.com\/channels\/(?:@me|(?<g>\d+))\/(?<c>\d+)\/(?<m>\d+)/g;
                    if (patt.test(value)) {
                        const stuff = value.split('/');
                        const message = yield ((_b = (_a = this.client.guilds.cache.get(stuff[4])) === null || _a === void 0 ? void 0 : _a.channels.cache.get(stuff[5])) === null || _b === void 0 ? void 0 : _b.messages.fetch(stuff[6]));
                        if (message && message.attachments.size >= 1) {
                            const url = message.attachments.first().url;
                            for (const type of fileTypes) {
                                if (url.indexOf(type) !== -1)
                                    file.push(url);
                            }
                        }
                    }
                }
                // Check message reply
                if (this.type == 'REPLY') {
                    const message = yield this.channel.messages.fetch(this.reference.messageId);
                    const url = message.attachments.first().url;
                    for (const type of fileTypes) {
                        if (url.indexOf(type) !== -1)
                            file.push(url);
                    }
                }
                // add avatar URL's to file
                file.push(...(yield this.getMember()).map(member => member.user.displayAvatarURL({ format: 'png', size: 1024 })));
                return file;
            });
        },
    },
    // Used for translating strings
    translate: {
        value: function (key, args) {
            var _a, _b;
            const language = this.client.translations.get((_b = (_a = this.guild) === null || _a === void 0 ? void 0 : _a.settings.Language) !== null && _b !== void 0 ? _b : 'en-US');
            if (!language)
                return 'Invalid language set in data.';
            return language(key, args);
        },
    },
    // Added timed message delete as djs v13 removed it.
    timedDelete: {
        value: function (obj) {
            setTimeout(() => {
                this.delete();
            }, obj.timeout || 3000);
        },
    },
});
