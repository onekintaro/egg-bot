// Dependencies
const Command = require('../../structures/Command.js'),
	{ ApplicationCommandOptionType, PermissionsBitField: { Flags } } = require('discord.js'),
	{ Embed } = require('../../utils');

/**
 * Reaction role add command
 * @extends {Command}
*/
class EmbedMessage extends Command {
	/**
 	 * @param {Client} client The instantiating client
 	 * @param {CommandData} data The data for the command
	*/
	constructor(bot) {
		super(bot, {
			name: 'embed',
			guildOnly: true,
			dirname: __dirname,
			aliases: ['embed-add'],
			userPermissions: [Flags.ManageGuild],
			botPermissions: [Flags.SendMessages, Flags.EmbedLinks, Flags.AddReactions, Flags.ManageRoles],
			description: 'Create a embed',
			usage: 'embed [channel] [color] [author] [title] [message]',
			cooldown: 5000,
			slash: true,
			options: [
				{
					name: 'channel',
					description: 'Channel ID',
					type: ApplicationCommandOptionType.Channel,
					required: true,
				},
				{
					name: 'color',
					description: 'Color',
					type: ApplicationCommandOptionType.String,
					required: true,
				},
				{
					name: 'author',
					description: 'Author',
					type: ApplicationCommandOptionType.String,
					required: true,
				},
				{
					name: 'title',
					description: 'Title',
					type: ApplicationCommandOptionType.String,
					required: true,
				},
				{
					name: 'text',
					description: 'Text',
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
		// const channel = message.content.split(' ').slice(1)[0];
		const text = message.content.split(' ').slice(2).join(' ');

		try {
			const msg = {
				color: text.split(';')[0],
				author: text.split(';')[1],
				title: text.split(';')[2],
				message: text.split(';')[3],
			};
			// Send response to channel
			const embed = new Embed(bot, message.guild)
				.setColor(`${msg.color}`)
				.setAuthor({ name: `${msg.author}`, iconURL: 'https://static.pokegang.ch/ui/pokegang.png' })
				.setTitle(`${msg.title}`)
				.setDescription(`${msg.message}`)
				.setImage('https://static.pokegang.ch/ui/spacer1000.png');
			message.channel.send({ embeds: [embed] });
			// bot.channels.cache.get(channel).send({ embeds: [embed] });
		} catch (err) {
			// An error occured when looking for account
			if (message.deletable) message.delete();
			bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
			return message.channel.error('misc:ERROR_MESSAGE', { ERROR: err.message });
		}
	}

	/**
 	 * Function for receiving interaction.
 	 * @param {bot} bot The instantiating client
 	 * @param {interaction} interaction The interaction that ran the command
 	 * @param {guild} guild The guild the interaction ran in
 	 * @param {args} args The options provided in the command, if any
 	 * @returns {embed}
	*/
	async callback(bot, interaction, guild, args) {
		const channel = guild.channels.cache.get(interaction.channelId),
			sendChannel = guild.channels.cache.get(args.get('channel').value);
			// link = args.get('url').value;

		try {
			// console.log(args.get('channel').value);
			// Send response to channel
			const msg = {
				color: args.get('color').value,
				author: args.get('author').value,
				title: args.get('title').value,
				message: args.get('text').value,
			};
			// Send response to channel
			const embed = new Embed(bot, guild)
				.setColor(`${msg.color}`)
				.setAuthor({ name: `${msg.author}`, iconURL: 'https://static.pokegang.ch/ui/pokegang.png' })
				.setTitle(`${msg.title}`)
				.setDescription(`${msg.message}`)
				.setImage('https://static.pokegang.ch/ui/spacer1000.png');
			// message.channel.send({ embeds: [embed] });
			// bot.channels.cache.get(channel).send({ embeds: [embed] });
			sendChannel.send({ embeds: [embed], ephemeral: true });
			return await interaction.reply({ content: 'Embed Sended to: ' + sendChannel.name, embeds: [embed] });
		} catch (err) {
			// An error occured when looking for account
			bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
			return interaction.editReply({ embeds: [channel.error('misc:ERROR_MESSAGE', { ERROR: err.message }, true)], ephemeral: true });
		}
	}
}

module.exports = EmbedMessage;
