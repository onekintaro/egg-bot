const { Schema, model } = require('mongoose');

const guildSchema = Schema({
	guildID: String,
	guildName: String,
	prefix: { type: String, default: require('../../assets/json/defaultGuildSettings.json').prefix },
	// Welcome Plugin
	welcomePlugin: { type: Boolean, default: false },
	// if anti-raid is true and welcome plugin is true both will get activated so this will make sure anti-riad runs first and once 'accepeted' welcome plugn will run
	welcomeRaidConnect: { type: Boolean, default: false },
	welcomeMessageToggle: { type: Boolean, default: false },
	welcomeMessageChannel: { type: String, default: '' },
	welcomeMessageText: { type: String, default: 'Hello {user}, Welcome to **{server}**!' },
	welcomeMessageEmbedToggle: { type: Boolean, default: false },
	welcomeMessageEmbed: { type: Object, default: {
		color: '0x0099ff',
		title: 'Welcome {user} to {server}',
		description: 'Take a look to <#changelog>',
		thumbnail: 'https://static.pokegang.ch/rnd-pokemon-{hash}.png',
	} },
	welcomePrivateToggle: { type: Boolean, default: false },
	welcomePrivateText: { type: String, default: 'Have a great time here in **{server}**.' },
	welcomeRoleToggle: { type: Boolean, default: false },
	welcomeRoleGive: { type: Array },
	welcomeGoodbyeToggle: { type: Boolean, default: false },
	welcomeGoodbyeText: { type: String, default: '**{user}** just left the server.' },
	// 0 = no announcement, 1 = reply, 2 = choosen channel
	LevelOption: { type: Number, default: 2 },
	LevelChannel: { type: String, default: '' },
	LevelMessage: { type: String, default: 'Gratuliere {user}, du hast gerade Level {level} erreicht!' },
	LevelIgnoreRoles: { type: Array, default: [] },
	LevelIgnoreChannel: { type: Array, default: [] },
	LevelMultiplier: { type: Number, default: 1 },
	LevelRoleRewards: { type: Array, default: [] },
	// Music plugin
	// MusicDJ: { type: Boolean, default: false },
	// MusicDJRole: { type: String },
	// logging plugin
	ModLog: { type: Boolean, default: true },
	ModLogEvents: { type: Array, default: [] },
	ModLogChannel: { type: String, default: '1031936723917217802' },
	ModLogIgnoreBot: { type: Boolean, default: true },
	ModLogIgnoreChannel: { type: Array, default: [] },
	// CommandCooldown
	// Tag plugin
	PrefixTags: { type: Boolean, default: false },
	// Moderation plugin
	ModeratorRoles: { type: Array, default: [] },
	// How many warnings till the user is kicked from server
	ModerationWarningCounter: { type: Number, default: 3 },
	// If moderation commands should be deleted after.
	ModerationClearToggle: { type: Boolean, default: true },
	// If every bot's should be affected by auto-mod
	ModerationIgnoreBotToggle: { type: Boolean, default: true },
	// language
	Language: { type: String, default: 'de-DE' },
	plugins: { type: Array, default: ['Pokegang', 'Fun', 'Giveaway', 'Guild', 'Image', 'Misc', 'Moderation', 'Plugins'] },
	version: { type: Number, default: '1.2' },
});

module.exports = model('Guild', guildSchema);
