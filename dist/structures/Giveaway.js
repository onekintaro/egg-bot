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
const { EventEmitter } = require('node:events'), { setTimeout, clearTimeout } = require('node:timers'), { ActionRowBuilder, resolvePartialEmoji, EmbedBuilder, embedLength } = require('discord.js'), DEFAULT_CHECK_INTERVAL = 15000;
/**
 * Represents a Giveaway.
 */
class Giveaway extends EventEmitter {
    /**
   * @param {GiveawaysManager} manager The giveaway manager.
   * @param {GiveawayData} options The giveaway data.
  */
    constructor(manager, options) {
        var _a, _b, _c;
        super();
        /**
         * The giveaway manager.
         * @type {GiveawaysManager}
         */
        this.manager = manager;
        /**
         * The end timeout for this giveaway
         * @private
         * @type {?NodeJS.Timeout}
         */
        this.endTimeout = null;
        /**
         * The Discord client.
         * @type {Discord.Client}
         */
        this.client = manager.client;
        /**
         * The giveaway prize.
         * @type {string}
         */
        this.prize = options.prize;
        /**
         * The start date of the giveaway.
         * @type {number}
         */
        this.startAt = options.startAt;
        /**
         * The end date of the giveaway.
         * @type {number}
         */
        this.endAt = (_a = options.endAt) !== null && _a !== void 0 ? _a : Infinity;
        /**
         * Whether the giveaway is ended.
         * @type {boolean}
         */
        this.ended = (_b = options.ended) !== null && _b !== void 0 ? _b : false;
        /**
         * The Id of the channel of the giveaway.
         * @type {Discord.Snowflake}
         */
        this.channelId = options.channelId;
        /**
         * The Id of the message of the giveaway.
         * @type {Discord.Snowflake}
         */
        this.messageId = options.messageId;
        /**
         * The Id of the guild of the giveaway.
         * @type {Discord.Snowflake}
         */
        this.guildId = options.guildId;
        /**
         * The number of winners for this giveaway.
         * @type {number}
         */
        this.winnerCount = options.winnerCount;
        /**
         * The winner Ids for this giveaway after it ended.
         * @type {string[]}
         */
        this.winnerIds = (_c = options.winnerIds) !== null && _c !== void 0 ? _c : [];
        /**
         * The mention of the user who hosts this giveaway.
         * @type {string}
         */
        this.hostedBy = options.hostedBy;
        /**
         * The giveaway messages.
         * @type {GiveawayMessages}
         */
        this.messages = options.messages;
        /**
         * The URL appearing as the thumbnail on the giveaway embed.
         * @type {string}
         */
        this.thumbnail = options.thumbnail;
        /**
         * The URL appearing as the image on the giveaway embed.
         * @type {string}
         */
        this.image = options.image;
        /**
         * Extra data concerning this giveaway.
         * @type {any}
         */
        this.extraData = options.extraData;
        /**
         * Which mentions should be parsed from the giveaway messages content.
         * @type {Discord.MessageMentionOptions}
         */
        this.allowedMentions = options.allowedMentions;
        /**
         * The giveaway data.
         * @type {GiveawayData}
         */
        this.options = options;
        /**
         * The message instance of the embed of this giveaway.
         * @type {?Discord.Message}
         */
        this.message = null;
    }
    /**
     * The link to the giveaway message.
     * @type {string}
     * @readonly
     */
    get messageURL() {
        return `https://discord.com/channels/${this.guildId}/${this.channelId}/${this.messageId}`;
    }
    /**
     * The remaining time before the end of the giveaway.
     * @type {number}
     * @readonly
     */
    get remainingTime() {
        return this.endAt - Date.now();
    }
    /**
     * The total duration of the giveaway.
     * @type {number}
     * @readonly
     */
    get duration() {
        return this.endAt - this.startAt;
    }
    /**
     * The color of the giveaway embed.
     * @type {Discord.ColorResolvable}
     */
    get embedColor() {
        var _a;
        return (_a = this.options.embedColor) !== null && _a !== void 0 ? _a : this.manager.options.default.embedColor;
    }
    /**
     * The color of the giveaway embed when it has ended.
     * @type {Discord.ColorResolvable}
     */
    get embedColorEnd() {
        var _a;
        return (_a = this.options.embedColorEnd) !== null && _a !== void 0 ? _a : this.manager.options.default.embedColorEnd;
    }
    /**
     * The emoji used for the reaction on the giveaway message.
     * @type {Discord.EmojiIdentifierResolvable}
     */
    get reaction() {
        var _a, _b, _c, _d, _e;
        if (!this.options.reaction && this.message) {
            const emoji = resolvePartialEmoji(this.manager.options.default.reaction);
            if (!this.message.reactions.cache.has((_a = emoji.id) !== null && _a !== void 0 ? _a : emoji.name)) {
                const reaction = this.message.reactions.cache.reduce((prev, curr) => (curr.count > prev.count ? curr : prev), { count: 0 });
                this.options.reaction = (_c = (_b = reaction.emoji) === null || _b === void 0 ? void 0 : _b.id) !== null && _c !== void 0 ? _c : (_d = reaction.emoji) === null || _d === void 0 ? void 0 : _d.name;
            }
        }
        return (_e = this.options.reaction) !== null && _e !== void 0 ? _e : this.manager.options.default.reaction;
    }
    /**
     * The options for the last chance system.
     * @type {LastChanceOptions}
     */
    get lastChance() {
        return this.manager.options.default.lastChance;
    }
    /**
     * Pause options for this giveaway
     * @type {PauseOptions}
     */
    get pauseOptions() {
        return this.options.pauseOptions;
    }
    /**
     * The reaction on the giveaway message.
     * @type {?Discord.MessageReaction}
     */
    get messageReaction() {
        var _a, _b;
        const emoji = resolvePartialEmoji(this.reaction);
        return ((_b = (_a = this.message) === null || _a === void 0 ? void 0 : _a.reactions.cache.find((r) => { var _a; return [r.emoji.name, r.emoji.id].filter(Boolean).includes((_a = emoji === null || emoji === void 0 ? void 0 : emoji.name) !== null && _a !== void 0 ? _a : emoji === null || emoji === void 0 ? void 0 : emoji.id); })) !== null && _b !== void 0 ? _b : null);
    }
    /**
     * The raw giveaway object for this giveaway.
     * @type {GiveawayData}
     */
    get data() {
        console.log('data', this);
        return {
            messageId: this.messageId,
            channelId: this.channelId,
            guildId: this.guildId,
            startAt: this.startAt,
            endAt: this.endAt,
            ended: this.ended,
            winnerCount: this.winnerCount,
            prize: this.prize,
            messages: this.messages,
            thumbnail: this.thumbnail,
            image: this.image,
            hostedBy: this.options.hostedBy,
            embedColor: this.manager.options.embedColor,
            embedColorEnd: this.manager.options.embedColorEnd,
            botsCanWin: this.options.botsCanWin,
            reaction: this.options.reaction,
            winnerIds: this.winnerIds.length ? this.winnerIds : undefined,
            extraData: this.extraData,
            lastChance: this.options.lastChance,
            pauseOptions: this.options.pauseOptions,
            isDrop: this.options.isDrop || undefined,
            allowedMentions: this.allowedMentions,
        };
    }
    /**
     * Ensure that an end timeout is created for this giveaway, in case it will end soon
     * @private
     * @returns {NodeJS.Timeout}
     */
    ensureEndTimeout() {
        if (this.endTimeout)
            return;
        if (this.remainingTime > (this.manager.options.forceUpdateEvery || DEFAULT_CHECK_INTERVAL))
            return;
        this.endTimeout = setTimeout(() => this.manager.end.call(this.manager, this.messageId).catch(() => null), this.remainingTime);
    }
    /**
     * Filles in a string with giveaway properties.
     * @param {string} string The string that should get filled in.
     * @returns {?string} The filled in string.
     */
    fillInString(string) {
        if (typeof string !== 'string')
            return null;
        [...new Set(string.match(/\{[^{}]{1,}\}/g))]
            .filter((match) => (match === null || match === void 0 ? void 0 : match.slice(1, -1).trim()) !== '')
            .forEach((match) => {
            let replacer;
            try {
                replacer = eval(match.slice(1, -1));
            }
            catch (_a) {
                replacer = match;
            }
            string = string.replaceAll(match, replacer);
        });
        return string.trim();
    }
    /**
     * Filles in a embed with giveaway properties.
     * @param {Discord.JSONEncodable<Discord.APIEmbed>|Discord.APIEmbed} embed The embed that should get filled in.
     * @returns {?Discord.EmbedBuilder} The filled in embed.
     */
    fillInEmbed(embed) {
        var _a, _b, _c;
        if (!embed || typeof embed !== 'object')
            return null;
        embed = EmbedBuilder.from(embed);
        embed.setTitle(this.fillInString(embed.data.title));
        embed.setDescription(this.fillInString(embed.data.description));
        if (typeof ((_a = embed.data.author) === null || _a === void 0 ? void 0 : _a.name) === 'string') {
            embed.data.author.name = this.fillInString(embed.data.author.name);
        }
        if (typeof ((_b = embed.data.footer) === null || _b === void 0 ? void 0 : _b.text) === 'string') {
            embed.data.footer.text = this.fillInString(embed.data.footer.text);
        }
        if ((_c = embed.data.fields) === null || _c === void 0 ? void 0 : _c.length) {
            embed.spliceFields(0, embed.data.fields.length, ...embed.data.fields.map((f) => {
                f.name = this.fillInString(f.name);
                f.value = this.fillInString(f.value);
                return f;
            }));
        }
        return embed;
    }
    /**
     * @param {Array<Discord.JSONEncodable<Discord.APIActionRowComponent<Discord.APIActionRowComponentTypes>>|Discord.APIActionRowComponent<Discord.APIActionRowComponentTypes>>} components The components that should get filled in.
     * @returns {?Array<Discord.ActionRowBuilder<Discord.MessageActionRowComponentBuilder>>} The filled in components.
     */
    fillInComponents(components) {
        if (!Array.isArray(components))
            return null;
        return components.map((row) => {
            row = ActionRowBuilder.from(row);
            row.components = row.components.map((component) => {
                var _a, _b, _c, _d, _e;
                (_a = component.data).custom_id && (_a.custom_id = this.fillInString(component.data.custom_id));
                (_b = component.data).label && (_b.label = this.fillInString(component.data.label));
                (_c = component.data).url && (_c.url = this.fillInString(component.data.url));
                (_d = component.data).placeholder && (_d.placeholder = this.fillInString(component.data.placeholder));
                (_e = component.data).options && (_e.options = component.data.options.map((options) => {
                    options.label = this.fillInString(options.label);
                    options.value = this.fillInString(options.value);
                    options.description && (options.description = this.fillInString(options.description));
                    return options;
                }));
                return component;
            });
            return row;
        });
    }
    /**
     * Fetches the giveaway message from its channel.
     * @returns {Promise<Discord.Message>} The Discord message
     */
    fetchMessage() {
        return __awaiter(this, void 0, void 0, function* () {
            // eslint-disable-next-line no-async-promise-executor
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let tryLater = true;
                const channel = yield this.client.channels.fetch(this.channelId).catch((err) => {
                    if (err.code === 10003)
                        tryLater = false;
                });
                const message = yield (channel === null || channel === void 0 ? void 0 : channel.messages.fetch(this.messageId).catch((err) => {
                    if (err.code === 10008)
                        tryLater = false;
                }));
                if (!message) {
                    if (!tryLater) {
                        this.manager.giveaways = this.manager.giveaways.filter((g) => g.messageId !== this.messageId);
                        yield this.manager.deleteGiveaway(this.messageId);
                    }
                    return reject('Unable to fetch message with Id ' + this.messageId + '.' + (tryLater ? ' Try later!' : ''));
                }
                resolve(message);
            }));
        });
    }
    /**
     * Fetches all users of the giveaway reaction, except bots, if not otherwise specified.
     * @returns {Promise<Discord.Collection<Discord.Snowflake, Discord.User>>} The collection of reaction users.
     */
    fetchAllEntrants() {
        return __awaiter(this, void 0, void 0, function* () {
            // eslint-disable-next-line no-async-promise-executor
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const message = yield this.fetchMessage().catch((err) => reject(err));
                if (!message)
                    return;
                this.message = message;
                const reaction = this.messageReaction;
                if (!reaction)
                    return reject('Unable to find the giveaway reaction.');
                let userCollection = yield reaction.users.fetch().catch(() => null);
                if (!userCollection)
                    return reject('Unable to fetch the reaction users.');
                while (userCollection.size % 100 === 0) {
                    const newUsers = yield reaction.users.fetch({ after: userCollection.lastKey() });
                    if (newUsers.size === 0)
                        break;
                    userCollection = userCollection.concat(newUsers);
                }
                const users = userCollection
                    .filter((u) => !u.bot || u.bot === this.botsCanWin)
                    .filter((u) => u.id !== this.client.user.id);
                resolve(users);
            }));
        });
    }
    /**
     * Checks if a user fulfills the requirements to win the giveaway.
     * @private
     * @param {Discord.User} user The user to check.
     * @returns {Promise<boolean>} If the entry was valid.
     */
    checkWinnerEntry(user) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (this.winnerIds.includes(user.id))
                return false;
            (_a = this.message) !== null && _a !== void 0 ? _a : (this.message = yield this.fetchMessage().catch(() => null));
            const member = yield ((_b = this.message) === null || _b === void 0 ? void 0 : _b.guild.members.fetch(user.id).catch(() => null));
            if (!member)
                return false;
            return true;
        });
    }
    /**
     * Gets the giveaway winner(s).
     * @param {number} [winnerCount=this.winnerCount] The number of winners to pick.
     * @returns {Promise<Discord.GuildMember[]>} The winner(s).
     */
    roll(winnerCount = this.winnerCount) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.message)
                return [];
            let guild = this.message.guild;
            // Try to fetch the guild from the client if the guild instance of the message does not have its shard defined
            if (this.client.shard && !guild.shard) {
                guild = (_a = (yield this.client.guilds.fetch(guild.id).catch(() => null))) !== null && _a !== void 0 ? _a : guild;
                // "Update" the message instance too, if possible.
                this.message = (_b = (yield this.fetchMessage().catch(() => null))) !== null && _b !== void 0 ? _b : this.message;
            }
            yield guild.members.fetch().catch(() => null);
            const users = yield this.fetchAllEntrants().catch(() => null);
            if (!(users === null || users === void 0 ? void 0 : users.size))
                return [];
            // Bonus Entries
            let userArray;
            const randomUsers = (amount) => {
                if (!userArray || userArray.length <= amount)
                    return users.random(amount);
                /**
                 * Random mechanism like https://github.com/discordjs/collection/blob/master/src/index.ts
                 * because collections/maps do not allow duplicates and so we cannot use their built in "random" function
                 */
                return Array.from({
                    length: Math.min(amount, users.size),
                }, () => userArray.splice(Math.floor(Math.random() * userArray.length), 1)[0]);
            };
            const winners = [];
            for (const u of randomUsers(winnerCount)) {
                const isValidEntry = !winners.some((winner) => winner.id === u.id) && (yield this.checkWinnerEntry(u));
                if (isValidEntry) {
                    winners.push(u);
                }
                else {
                    // Find a new winner
                    for (let i = 0; i < users.size; i++) {
                        const user = randomUsers(1)[0];
                        const isUserValidEntry = !winners.some((winner) => winner.id === user.id) && (yield this.checkWinnerEntry(user));
                        if (isUserValidEntry) {
                            winners.push(user);
                            break;
                        }
                        users.delete(user.id);
                        userArray = userArray === null || userArray === void 0 ? void 0 : userArray.filter((usr) => usr.id !== user.id);
                    }
                }
            }
            return yield Promise.all(winners.map((user) => __awaiter(this, void 0, void 0, function* () { return yield guild.members.fetch(user.id).catch(() => null); })));
        });
    }
    /**
     * Edits the giveaway.
     * @param {GiveawayEditOptions} options The edit options.
     * @returns {Promise<Giveaway>} The edited giveaway.
     */
    edit(options = {}) {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (this.ended)
                return reject('Giveaway with message Id ' + this.messageId + ' is already ended.');
            (_a = this.message) !== null && _a !== void 0 ? _a : (this.message = yield this.fetchMessage().catch(() => null));
            if (!this.message)
                return reject('Unable to fetch message with Id ' + this.messageId + '.');
            // Update data
            if (typeof options.newThumbnail === 'string')
                this.thumbnail = options.newThumbnail;
            if (typeof options.newImage === 'string')
                this.image = options.newImage;
            if (typeof options.newPrize === 'string')
                this.prize = options.newPrize;
            if (options.newExtraData)
                this.extraData = options.newExtraData;
            if (Number.isInteger(options.newWinnerCount) && options.newWinnerCount > 0 && !this.isDrop) {
                this.winnerCount = options.newWinnerCount;
            }
            if (Number.isFinite(options.addTime) && !this.isDrop) {
                this.endAt = this.endAt + options.addTime;
                if (this.endTimeout)
                    clearTimeout(this.endTimeout);
                this.ensureEndTimeout();
            }
            if (Number.isFinite(options.setEndTimestamp) && !this.isDrop)
                this.endAt = options.setEndTimestamp;
            if (Array.isArray(options.newBonusEntries) && !this.isDrop) {
                this.options.bonusEntries = options.newBonusEntries.filter((elem) => typeof elem === 'object');
            }
            if (typeof options.newExemptMembers === 'function') {
                this.options.exemptMembers = options.newExemptMembers;
            }
            yield this.manager.editGiveaway(this.messageId, this.data);
            if (this.remainingTime <= 0) {
                this.manager.end(this.messageId).catch(() => null);
            }
            else {
                const embed = this.manager.generateMainEmbed(this);
                yield this.message
                    .edit({
                    content: this.fillInString(this.messages.giveaway),
                    embeds: [embed],
                    allowedMentions: this.allowedMentions,
                })
                    .catch(() => null);
            }
            resolve(this);
        }));
    }
    /**
     * Ends the giveaway.
     * @param {?string|MessageObject} [noWinnerMessage=null] Sent in the channel if there is no valid winner for the giveaway.
     * @returns {Promise<Discord.GuildMember[]>} The winner(s).
     */
    end(noWinnerMessage = null) {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e;
            if (this.ended)
                return reject('Giveaway with message Id ' + this.messageId + ' is already ended');
            this.ended = true;
            // Always fetch the message in order to reject early
            this.message = yield this.fetchMessage().catch((err) => {
                if (err.includes('Try later!'))
                    this.ended = false;
                return reject(err);
            });
            if (!this.message)
                return;
            if (this.endAt < this.client.readyTimestamp || this.isDrop || ((_a = this.options.pauseOptions) === null || _a === void 0 ? void 0 : _a.isPaused)) {
                this.endAt = Date.now();
            }
            if ((_b = this.options.pauseOptions) === null || _b === void 0 ? void 0 : _b.isPaused)
                this.options.pauseOptions.isPaused = false;
            yield this.manager.editGiveaway(this.messageId, this.data);
            const winners = yield this.roll();
            const channel = this.message.channel.isThread() && !this.message.channel.sendable
                ? this.message.channel.parent
                : this.message.channel;
            if (winners.length > 0) {
                this.winnerIds = winners.map((w) => w.id);
                yield this.manager.editGiveaway(this.messageId, this.data);
                let embed = this.manager.generateEndEmbed(this, winners);
                yield this.message
                    .edit({
                    content: this.fillInString(this.messages.giveawayEnded),
                    embeds: [embed],
                    allowedMentions: this.allowedMentions,
                })
                    .catch(() => null);
                let formattedWinners = winners.map((w) => `<@${w.id}>`).join(', ');
                const winMessage = this.fillInString(this.messages.winMessage.content || this.messages.winMessage);
                const message = winMessage === null || winMessage === void 0 ? void 0 : winMessage.replace('{winners}', formattedWinners);
                const components = this.fillInComponents(this.messages.winMessage.components);
                if ((message === null || message === void 0 ? void 0 : message.length) > 2000) {
                    const firstContentPart = winMessage.slice(0, winMessage.indexOf('{winners}'));
                    if (firstContentPart.length) {
                        channel.send({
                            content: firstContentPart,
                            allowedMentions: this.allowedMentions,
                            reply: {
                                messageReference: typeof this.messages.winMessage.replyToGiveaway === 'boolean'
                                    ? this.messageId
                                    : undefined,
                                failIfNotExists: false,
                            },
                        });
                    }
                    while (formattedWinners.length >= 2000) {
                        yield channel.send({
                            content: formattedWinners.slice(0, formattedWinners.lastIndexOf(',', 1999)) + ',',
                            allowedMentions: this.allowedMentions,
                        });
                        formattedWinners = formattedWinners.slice(formattedWinners.slice(0, formattedWinners.lastIndexOf(',', 1999) + 2).length);
                    }
                    channel.send({ content: formattedWinners, allowedMentions: this.allowedMentions });
                    const lastContentPart = winMessage.slice(winMessage.indexOf('{winners}') + 9);
                    if (lastContentPart.length) {
                        channel.send({
                            content: lastContentPart,
                            components: this.messages.winMessage.embed && typeof this.messages.winMessage.embed === 'object'
                                ? null
                                : components,
                            allowedMentions: this.allowedMentions,
                        });
                    }
                }
                if (this.messages.winMessage.embed && typeof this.messages.winMessage.embed === 'object') {
                    if ((message === null || message === void 0 ? void 0 : message.length) > 2000)
                        formattedWinners = winners.map((w) => `<@${w.id}>`).join(', ');
                    embed = this.fillInEmbed(this.messages.winMessage.embed);
                    const embedDescription = (_d = (_c = embed.data.description) === null || _c === void 0 ? void 0 : _c.replace('{winners}', formattedWinners)) !== null && _d !== void 0 ? _d : '';
                    if (embedDescription.length <= 4096) {
                        channel.send({
                            content: (message === null || message === void 0 ? void 0 : message.length) <= 2000 ? message : null,
                            embeds: [embed.setDescription(embedDescription)],
                            components,
                            allowedMentions: this.allowedMentions,
                            reply: {
                                messageReference: !((message === null || message === void 0 ? void 0 : message.length) > 2000) && typeof this.messages.winMessage.replyToGiveaway === 'boolean'
                                    ? this.messageId
                                    : undefined,
                                failIfNotExists: false,
                            },
                        });
                    }
                    else {
                        const firstEmbed = new EmbedBuilder(embed).setDescription(embed.data.description.slice(0, embed.data.description.indexOf('{winners}')) || null);
                        if (embedLength(firstEmbed.data)) {
                            channel.send({
                                content: (message === null || message === void 0 ? void 0 : message.length) <= 2000 ? message : null,
                                embeds: [firstEmbed],
                                allowedMentions: this.allowedMentions,
                                reply: {
                                    messageReference: !((message === null || message === void 0 ? void 0 : message.length) > 2000) && typeof this.messages.winMessage.replyToGiveaway === 'boolean'
                                        ? this.messageId
                                        : undefined,
                                    failIfNotExists: false,
                                },
                            });
                        }
                        const tempEmbed = new EmbedBuilder().setColor((_e = embed.data.color) !== null && _e !== void 0 ? _e : null);
                        while (formattedWinners.length >= 4096) {
                            yield channel.send({
                                embeds: [
                                    tempEmbed.setDescription(formattedWinners.slice(0, formattedWinners.lastIndexOf(',', 4095)) + ','),
                                ],
                                allowedMentions: this.allowedMentions,
                            });
                            formattedWinners = formattedWinners.slice(formattedWinners.slice(0, formattedWinners.lastIndexOf(',', 4095) + 2).length);
                        }
                        channel.send({
                            embeds: [tempEmbed.setDescription(formattedWinners)],
                            allowedMentions: this.allowedMentions,
                        });
                        const lastEmbed = tempEmbed.setDescription(embed.data.description.slice(embed.data.description.indexOf('{winners}') + 9) || null);
                        if (embedLength(lastEmbed.data)) {
                            channel.send({ embeds: [lastEmbed], components, allowedMentions: this.allowedMentions });
                        }
                    }
                }
                else if ((message === null || message === void 0 ? void 0 : message.length) <= 2000) {
                    channel.send({
                        content: message,
                        components,
                        allowedMentions: this.allowedMentions,
                        reply: {
                            messageReference: typeof this.messages.winMessage.replyToGiveaway === 'boolean'
                                ? this.messageId
                                : undefined,
                            failIfNotExists: false,
                        },
                    });
                }
                resolve(winners);
            }
            else {
                const message = this.fillInString((noWinnerMessage === null || noWinnerMessage === void 0 ? void 0 : noWinnerMessage.content) || noWinnerMessage);
                const embed = this.fillInEmbed(noWinnerMessage === null || noWinnerMessage === void 0 ? void 0 : noWinnerMessage.embed);
                if (message || embed) {
                    channel.send({
                        content: message,
                        embeds: embed ? [embed] : null,
                        components: this.fillInComponents(noWinnerMessage === null || noWinnerMessage === void 0 ? void 0 : noWinnerMessage.components),
                        allowedMentions: this.allowedMentions,
                        reply: {
                            messageReference: typeof (noWinnerMessage === null || noWinnerMessage === void 0 ? void 0 : noWinnerMessage.replyToGiveaway) === 'boolean' ? this.messageId : undefined,
                            failIfNotExists: false,
                        },
                    });
                }
                yield this.message
                    .edit({
                    content: this.fillInString(this.messages.giveawayEnded),
                    embeds: [this.manager.generateNoValidParticipantsEndEmbed(this)],
                    allowedMentions: this.allowedMentions,
                })
                    .catch(() => null);
                resolve([]);
            }
        }));
    }
    /**
     * Rerolls the giveaway.
     * @param {GiveawayRerollOptions} [options] The reroll options.
     * @returns {Promise<Discord.GuildMember[]>}
     */
    reroll(options = {}) {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            if (!this.ended)
                return reject('Giveaway with message Id ' + this.messageId + ' is not ended.');
            (_a = this.message) !== null && _a !== void 0 ? _a : (this.message = yield this.fetchMessage().catch(() => null));
            if (!this.message)
                return reject('Unable to fetch message with Id ' + this.messageId + '.');
            if (this.isDrop)
                return reject('Drop giveaways cannot get rerolled!');
            if (!options || typeof options !== 'object')
                return reject(`"options" is not an object (val=${options})`);
            if (options.winnerCount && (!Number.isInteger(options.winnerCount) || options.winnerCount < 1)) {
                return reject(`options.winnerCount is not a positive integer. (val=${options.winnerCount})`);
            }
            const winners = yield this.roll(options.winnerCount || undefined);
            const channel = this.message.channel.isThread() && !this.message.channel.sendable
                ? this.message.channel.parent
                : this.message.channel;
            if (winners.length > 0) {
                this.winnerIds = winners.map((w) => w.id);
                yield this.manager.editGiveaway(this.messageId, this.data);
                let embed = this.manager.generateEndEmbed(this, winners);
                yield this.message
                    .edit({
                    content: this.fillInString(this.messages.giveawayEnded),
                    embeds: [embed],
                    allowedMentions: this.allowedMentions,
                })
                    .catch(() => null);
                let formattedWinners = winners.map((w) => `<@${w.id}>`).join(', ');
                const congratMessage = this.fillInString(options.messages.congrat.content || options.messages.congrat);
                const message = congratMessage === null || congratMessage === void 0 ? void 0 : congratMessage.replace('{winners}', formattedWinners);
                const components = this.fillInComponents(options.messages.congrat.components);
                if ((message === null || message === void 0 ? void 0 : message.length) > 2000) {
                    const firstContentPart = congratMessage.slice(0, congratMessage.indexOf('{winners}'));
                    if (firstContentPart.length) {
                        channel.send({
                            content: firstContentPart,
                            allowedMentions: this.allowedMentions,
                            reply: {
                                messageReference: typeof options.messages.congrat.replyToGiveaway === 'boolean'
                                    ? this.messageId
                                    : undefined,
                                failIfNotExists: false,
                            },
                        });
                    }
                    while (formattedWinners.length >= 2000) {
                        yield channel.send({
                            content: formattedWinners.slice(0, formattedWinners.lastIndexOf(',', 1999)) + ',',
                            allowedMentions: this.allowedMentions,
                        });
                        formattedWinners = formattedWinners.slice(formattedWinners.slice(0, formattedWinners.lastIndexOf(',', 1999) + 2).length);
                    }
                    channel.send({ content: formattedWinners, allowedMentions: this.allowedMentions });
                    const lastContentPart = congratMessage.slice(congratMessage.indexOf('{winners}') + 9);
                    if (lastContentPart.length) {
                        channel.send({
                            content: lastContentPart,
                            components: options.messages.congrat.embed && typeof options.messages.congrat.embed === 'object'
                                ? null
                                : components,
                            allowedMentions: this.allowedMentions,
                        });
                    }
                }
                if (options.messages.congrat.embed && typeof options.messages.congrat.embed === 'object') {
                    if ((message === null || message === void 0 ? void 0 : message.length) > 2000)
                        formattedWinners = winners.map((w) => `<@${w.id}>`).join(', ');
                    embed = this.fillInEmbed(options.messages.congrat.embed);
                    const embedDescription = (_c = (_b = embed.data.description) === null || _b === void 0 ? void 0 : _b.replace('{winners}', formattedWinners)) !== null && _c !== void 0 ? _c : '';
                    if (embedDescription.length <= 4096) {
                        channel.send({
                            content: (message === null || message === void 0 ? void 0 : message.length) <= 2000 ? message : null,
                            embeds: [embed.setDescription(embedDescription)],
                            components,
                            allowedMentions: this.allowedMentions,
                            reply: {
                                messageReference: !((message === null || message === void 0 ? void 0 : message.length) > 2000) && typeof options.messages.congrat.replyToGiveaway === 'boolean'
                                    ? this.messageId
                                    : undefined,
                                failIfNotExists: false,
                            },
                        });
                    }
                    else {
                        const firstEmbed = new EmbedBuilder(embed).setDescription(embed.data.description.slice(0, embed.data.description.indexOf('{winners}')) || null);
                        if (embedLength(firstEmbed.toJSON())) {
                            channel.send({
                                content: (message === null || message === void 0 ? void 0 : message.length) <= 2000 ? message : null,
                                embeds: [firstEmbed],
                                allowedMentions: this.allowedMentions,
                                reply: {
                                    messageReference: !((message === null || message === void 0 ? void 0 : message.length) > 2000) && typeof options.messages.congrat.replyToGiveaway === 'boolean'
                                        ? this.messageId
                                        : undefined,
                                    failIfNotExists: false,
                                },
                            });
                        }
                        const tempEmbed = new EmbedBuilder().setColor((_d = embed.data.color) !== null && _d !== void 0 ? _d : null);
                        while (formattedWinners.length >= 4096) {
                            yield channel.send({
                                embeds: [
                                    tempEmbed.setDescription(formattedWinners.slice(0, formattedWinners.lastIndexOf(',', 4095)) + ','),
                                ],
                                allowedMentions: this.allowedMentions,
                            });
                            formattedWinners = formattedWinners.slice(formattedWinners.slice(0, formattedWinners.lastIndexOf(',', 4095) + 2).length);
                        }
                        channel.send({
                            embeds: [tempEmbed.setDescription(formattedWinners)],
                            allowedMentions: this.allowedMentions,
                        });
                        const lastEmbed = tempEmbed.setDescription(embed.data.description.slice(embed.data.description.indexOf('{winners}') + 9) || null);
                        if (embedLength(lastEmbed.toJSON())) {
                            channel.send({ embeds: [lastEmbed], components, allowedMentions: this.allowedMentions });
                        }
                    }
                }
                else if ((message === null || message === void 0 ? void 0 : message.length) <= 2000) {
                    channel.send({
                        content: message,
                        components,
                        allowedMentions: this.allowedMentions,
                        reply: {
                            messageReference: typeof options.messages.congrat.replyToGiveaway === 'boolean'
                                ? this.messageId
                                : undefined,
                            failIfNotExists: false,
                        },
                    });
                }
                resolve(winners);
            }
            else {
                if (options.messages.replyWhenNoWinner !== false) {
                    const embed = this.fillInEmbed(options.messages.error.embed);
                    channel.send({
                        content: this.fillInString(options.messages.error.content || options.messages.error),
                        embeds: embed ? [embed] : null,
                        components: this.fillInComponents(options.messages.error.components),
                        allowedMentions: this.allowedMentions,
                        reply: {
                            messageReference: typeof options.messages.error.replyToGiveaway === 'boolean'
                                ? this.messageId
                                : undefined,
                            failIfNotExists: false,
                        },
                    });
                }
                resolve([]);
            }
        }));
    }
    /**
     * Pauses the giveaway.
     * @param {PauseOptions} [options=giveaway.pauseOptions] The pause options.
     * @returns {Promise<Giveaway>} The paused giveaway.
     */
    pause(options = {}) {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (this.ended)
                return reject('Giveaway with message Id ' + this.messageId + ' is already ended.');
            (_a = this.message) !== null && _a !== void 0 ? _a : (this.message = yield this.fetchMessage().catch(() => null));
            if (!this.message)
                return reject('Unable to fetch message with Id ' + this.messageId + '.');
            if (this.pauseOptions.isPaused) {
                return reject('Giveaway with message Id ' + this.messageId + ' is already paused.');
            }
            if (this.isDrop)
                return reject('Drop giveaways cannot get paused!');
            if (this.endTimeout)
                clearTimeout(this.endTimeout);
            // Update data
            const pauseOptions = this.options.pauseOptions || {};
            if (typeof options.content === 'string')
                pauseOptions.content = options.content;
            if (Number.isFinite(options.unpauseAfter)) {
                if (options.unpauseAfter < Date.now()) {
                    pauseOptions.unpauseAfter = Date.now() + options.unpauseAfter;
                    this.endAt = this.endAt + options.unpauseAfter;
                }
                else {
                    pauseOptions.unpauseAfter = options.unpauseAfter;
                    this.endAt = this.endAt + options.unpauseAfter - Date.now();
                }
            }
            else {
                delete pauseOptions.unpauseAfter;
                pauseOptions.durationAfterPause = this.remainingTime;
                this.endAt = Infinity;
            }
            pauseOptions.embedColor = options.embedColor;
            if (typeof options.infiniteDurationText === 'string') {
                pauseOptions.infiniteDurationText = options.infiniteDurationText;
            }
            pauseOptions.isPaused = true;
            this.options.pauseOptions = pauseOptions;
            yield this.manager.editGiveaway(this.messageId, this.data);
            const embed = this.manager.generateMainEmbed(this);
            yield this.message
                .edit({
                content: this.fillInString(this.messages.giveaway),
                embeds: [embed],
                allowedMentions: this.allowedMentions,
            })
                .catch(() => null);
            resolve(this);
        }));
    }
    /**
     * Unpauses the giveaway.
     * @returns {Promise<Giveaway>} The unpaused giveaway.
     */
    unpause() {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (this.ended)
                return reject('Giveaway with message Id ' + this.messageId + ' is already ended.');
            (_a = this.message) !== null && _a !== void 0 ? _a : (this.message = yield this.fetchMessage().catch(() => null));
            if (!this.message)
                return reject('Unable to fetch message with Id ' + this.messageId + '.');
            if (!this.pauseOptions.isPaused) {
                return reject('Giveaway with message Id ' + this.messageId + ' is not paused.');
            }
            if (this.isDrop)
                return reject('Drop giveaways cannot get unpaused!');
            // Update data
            if (Number.isFinite(this.pauseOptions.durationAfterPause)) {
                this.endAt = Date.now() + this.pauseOptions.durationAfterPause;
            }
            delete this.options.pauseOptions.unpauseAfter;
            this.options.pauseOptions.isPaused = false;
            this.ensureEndTimeout();
            yield this.manager.editGiveaway(this.messageId, this.data);
            const embed = this.manager.generateMainEmbed(this);
            yield this.message
                .edit({
                content: this.fillInString(this.messages.giveaway),
                embeds: [embed],
                allowedMentions: this.allowedMentions,
            })
                .catch(() => null);
            resolve(this);
        }));
    }
}
module.exports = Giveaway;
