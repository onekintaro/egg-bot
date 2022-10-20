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
const { Guild } = require('discord.js'), { GuildSchema, RankSchema } = require('../database/models'), { logger } = require('../utils');
// Add custom stuff to Guild
module.exports = Object.defineProperties(Guild.prototype, {
    // Fetch guild settings
    fetchSettings: {
        value: function () {
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
                this.settings = (_a = yield GuildSchema.findOne({ guildID: this.id })) !== null && _a !== void 0 ? _a : require('../assets/json/defaultGuildSettings.json');
                return this.settings;
            });
        },
    },
    // Update guild settings
    updateGuild: {
        value: function (settings) {
            return __awaiter(this, void 0, void 0, function* () {
                logger.log(`Guild: [${this.id}] updated settings: ${Object.keys(settings)}`);
                // Check if the DB is getting updated or creating new schema
                if (this.settings.guildID) {
                    yield GuildSchema.findOneAndUpdate({ guildID: this.id }, settings);
                }
                else {
                    const newGuild = new GuildSchema(Object.assign({ guildID: this.id, guildName: this.name }, settings));
                    yield newGuild.save();
                }
                return this.fetchSettings();
            });
        },
    },
    // Used for translating strings
    translate: {
        value: function (key, args) {
            const language = this.client.translations.get(this.settings.Language);
            if (!language)
                return 'Invalid language set in data.';
            return language(key, args);
        },
    },
    // Fetch ranks for this guild
    fetchLevels: {
        value: function () {
            return __awaiter(this, void 0, void 0, function* () {
                this.levels = yield RankSchema.find({ guildID: this.id });
                return this.levels;
            });
        },
    },
    // Append the settings to guild
    settings: {
        value: {},
        writable: true,
    },
    // Append guild-tags to guild
    guildTags: {
        value: [],
        writable: true,
    },
    // Append premium to guild
    premium: {
        value: false,
        writable: true,
    },
    // Append users' ranks to guild
    levels: {
        value: [],
        writable: true,
    },
});
