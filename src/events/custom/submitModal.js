// Dependencies
const { Embed } = require('../../utils'),
	{ Collection, PermissionsBitField: { Flags: PermFlag } } = require('discord.js'),
	{ ChannelType } = require('discord-api-types/v10'),
	cooldowns = new Collection(),
	Event = require('../../structures/Event');

/**
 * Click button event
 * @event Egglord#SubmitModal
 * @extends {Event}
*/
class SubmitModal extends Event {
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

		switch (ID) {
			case 'switch':
				console.log(button);
				return bot.emit('switchAdd', button);
		}
	}

	async checkUser(user1, button) {
		if(user1 === button.user.id) {
			button.reply({ content: 'Access Test OK' });
			return true;
		} else {
			button.reply({ content: 'Access Test FAIL' });
			return false;
		}
	}
}

module.exports = SubmitModal;
