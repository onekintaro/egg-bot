// Dependencies
const { Embed } = require('../../utils'),
	{ ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, Collection, PermissionsBitField: { Flags: PermFlag } } = require('discord.js'),
	{ ChannelType } = require('discord-api-types/v10'),
	Event = require('../../structures/Event');

/**
 * Click button event
 * @event Egglord#SwitchAdd
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

		button.message.edit({ content: 'sending Test', embeds: [], components: [] });

		const modal = new ModalBuilder()
			.setCustomId('fc-switch-add')
			.setTitle('add Friendcodes');

		// Add components to modal

		// Create the text input components
		const fc1 = new TextInputBuilder()
			.setCustomId('fc1')
			// The label is the prompt the user sees for this input
			.setLabel('Primary Friendcode')
			.setPlaceholder('0000-0000-0000')
			.setMaxLength(16)
			.setMinLength(14)
			// Short means only a single line of text
			.setStyle(TextInputStyle.Short)
			.setRequired(true);

		const fc2 = new TextInputBuilder()
			.setCustomId('fc2')
			// The label is the prompt the user sees for this input
			.setLabel('additional Friendcode')
			.setPlaceholder('0000-0000-0000')
			// Short means only a single line of text
			.setStyle(TextInputStyle.Short)
			.setRequired(false);


		// An action row only holds one text input,
		// so you need one action row per text input.
		const ar1 = new ActionRowBuilder().addComponents(fc1);
		const ar2 = new ActionRowBuilder().addComponents(fc2);

		// Add inputs to the modal
		modal.addComponents(ar1, ar2);

		// Show the modal to the user
		await button.showModal(modal);

	}
}

module.exports = SwitchAdd;
