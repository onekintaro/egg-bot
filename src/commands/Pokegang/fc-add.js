// Dependencies
const { content } = require('../../structures/Message');
const { time: { getTotalTime } } = require('../../utils'),
	{ ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ApplicationCommandOptionType, PermissionsBitField: { Flags } } = require('discord.js'),
	{ ChannelType } = require('discord-api-types/v10'),
	Command = require('../../structures/Command.js');

/**
 * Giveaway start command
 * @extends {Command}
*/
class FcAdd extends Command {
	/**
   * @param {Client} client The instantiating client
   * @param {CommandData} data The data for the command
  */
	constructor(bot) {
		super(bot, {
			name: 'fc-add',
			guildOnly: true,
			dirname: __dirname,
			botPermissions: [Flags.SendMessages, Flags.EmbedLinks],
			description: 'add fc',
			usage: 'add fc',
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
		const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('switch')
					.setEmoji('1030784118977470595')
					.setLabel('Nintendo Switch')
					.setStyle(ButtonStyle.Primary),
			)
			.addComponents(
				new ButtonBuilder()
					.setCustomId('pogo')
					.setEmoji('1030784133250699364')
					.setLabel('Pokémon GO')
					.setStyle(ButtonStyle.Primary),
			);

		const embed = new EmbedBuilder()
			.setColor(0x0099FF)
			.setDescription('ℹ️ You can add up to 10 friendcodes per user. 5 each per console.');

		const msg1 = 'what kind of friendcode do you want to add?';
		const msg2 = 'Open Modal';

		await interaction.reply({ content: msg1, components: [row], embeds: [embed], ephemeral: false });

	}

}

module.exports = FcAdd;
