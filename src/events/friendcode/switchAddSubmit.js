// Dependencies
const { Embed } = require('../../utils'),
	{ ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, Collection, PermissionsBitField: { Flags: PermFlag } } = require('discord.js'),
	{ ChannelType } = require('discord-api-types/v10'),
	Event = require('../../structures/Event');

/**
 * Click button event
 * @event Egglord#SwitchAddSubmit
 * @extends {Event}
*/
class SwitchAdd extends Event {
	constructor(...args) {
		super(...args, {
			dirname: __dirname,
		});
	}

	/**
	 * Function for receiving event.
	 * @param {bot} bot The instantiating client
	 * @param {ButtonInteraction} button The button that was pressed
	 * @readonly
	*/
	async run(bot, button) {
		const { customId: ID, guildId, channelId, member } = button,
			guild = bot.guilds.cache.get(guildId),
			channel = bot.channels.cache.get(channelId);

		button.message.edit({ content: 'sending Test OK', embeds: [], components: [] });
}

module.exports = SwitchAddSubmit;
