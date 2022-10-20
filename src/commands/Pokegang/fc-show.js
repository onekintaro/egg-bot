// Dependencies
const { content } = require('../../structures/Message');
const { time: { getTotalTime } } = require('../../utils'),
	{ ApplicationCommandOptionType, PermissionsBitField: { Flags } } = require('discord.js'),
	{ ChannelType } = require('discord-api-types/v10'),
	Command = require('../../structures/Command.js');

/**
 * Giveaway start command
 * @extends {Command}
*/
class FcShow extends Command {
	/**
   * @param {Client} client The instantiating client
   * @param {CommandData} data The data for the command
  */
	constructor(bot) {
		super(bot, {
			name: 'fc-show',
			guildOnly: true,
			dirname: __dirname,
			botPermissions: [Flags.SendMessages, Flags.EmbedLinks],
			description: 'show fc',
			usage: 'show fc',
			cooldown: 30000,
			slash: false,
		});
	}

	/**
 	 * Function for receiving message.
 	 * @param {bot} bot The instantiating client
 	 * @param {message} message The message that ran the command
 	 * @param {settings} settings The settings of the channel the command ran in
 	 * @readonly
  */
	async run(bot, message, settings) {
		const result = message.translate('helper:SLASH_ONLY', { COMMAND: message.content.replace(settings.prefix, '') });
		message.channel.send({ content: result });
	}

	/**
	 * Function for receiving interaction.
	 * @param {bot} bot The instantiating client
	 * @param {interaction} interaction The interaction that ran the command
	 * @param {guild} guild The guild the interaction ran in
	 * @param {args} args The options provided in the command, if any
	 * @readonly
	*/
	async callback(bot, interaction, guild, args) {
		interaction.reply({ content: 'test' });
	}

}

module.exports = FcShow;
