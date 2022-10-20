// Dependencies
const	{ AttachmentBuilder, ApplicationCommandOptionType, PermissionsBitField: { Flags } } = require('discord.js'),
	fetch = require('node-fetch'),
	{ Embed } = require('../../utils'),
	Command = require('../../structures/Command.js');

/**
 * QRCode command
 * @extends {Command}
*/
class QRcode extends Command {
	/**
 	 * @param {Client} client The instantiating client
 	 * @param {CommandData} data The data for the command
	*/
	constructor(bot) {
		super(bot, {
			name: 'craiyon',
			dirname: __dirname,
			aliases: ['dall-e'],
			botPermissions: [Flags.SendMessages, Flags.EmbedLinks],
			description: 'Creates a ai Image.',
			usage: 'craiyon <text>',
			cooldown: 60000,
			examples: ['craiyon I want to play basketball', 'dall-e Pokémon'],
			slash: true,
			options: [
				{
					name: 'text',
					description: 'image description',
					type: ApplicationCommandOptionType.String,
					required: true,
				},
			],
		});
	}

	/**
	 * Function for receiving message.
	 * @param {bot} bot The instantiating client
 	 * @param {message} message The message that ran the command
 	 * @readonly
	*/

	async run(bot, message) {
		// Get text for QR encoding (including file URl)
		const text = message.args.join(' ');

		// send 'waiting' message to show bot has recieved message
		const msg = await message.channel.send(message.translate('misc:GENERATING_IMAGES_LONG', {
			EMOJI: message.channel.checkPerm('USE_EXTERNAL_EMOJIS') ? bot.customEmojis['loading'] : '' }));

		// Try and convert image
		try {
			const json = await fetch('https://backend.craiyon.com/generate', {
				'headers': {
					'accept': 'application/json',
					'content-type': 'application/json',
				},
				'body': `{"prompt": "${text}"}`,
				'method': 'POST',
			}).then(res => res.json());

			const imageStream = Buffer.from(json.images[0], 'base64');
			const attachment = new AttachmentBuilder(imageStream, { name: 'craiyon.png' });

			// send image
			const embed = new Embed(bot, message.guild)
				.setColor(3447003)
				.setAuthor({ name: 'Craiyon.com', iconURL: 'https://static.pokegang.ch/ui/craiyon.png' })
				.setTitle(bot.translate('image/craiyon:TITLE'))
				.setDescription(bot.translate('image/craiyon:INPUT') + ' ' + text)
				.setImage('attachment://craiyon.png');
			message.channel.send({ embeds: [embed], files: [attachment] });
		} catch(err) {
			if (message.deletable) message.delete();
			bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
			message.channel.error('misc:ERROR_MESSAGE', { ERROR: err.message });
		}
		msg.delete();
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
		const text = args.get('text').value,
			channel = guild.channels.cache.get(interaction.channelId);

		await interaction.reply({ content: guild.translate('misc:GENERATING_IMAGE', { EMOJI: bot.customEmojis['loading'] }) });

		try {
			const json = await fetch('https://backend.craiyon.com/generate', {
				'headers': {
					'accept': 'application/json',
					'content-type': 'application/json',
				},
				'body': `{"prompt": "${text}"}`,
				'method': 'POST',
			}).then(res => res.json());

			const imageStream = Buffer.from(json.images[0], 'base64');
			const attachment = new AttachmentBuilder(imageStream, { name: 'craiyon.png' });

			// send image
			const embed = new Embed(bot, guild)
				.setColor(3447003)
				.setAuthor({ name: 'Craiyon.com', iconURL: 'https://static.pokegang.ch/ui/craiyon.png' })
				.setTitle(bot.translate('image/craiyon:TITLE'))
				.setDescription(bot.translate('image/craiyon:INPUT') + ' ' + text)
				.setImage('attachment://craiyon.png');
			interaction.editReply({ content: ' ', embeds: [embed], files: [attachment] });
		} catch(err) {
			bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
			return interaction.editReply({ content: ' ', embeds: [channel.error('misc:ERROR_MESSAGE', { ERROR: err.message }, true)], ephemeral: true });
		}
	}
}

module.exports = QRcode;
