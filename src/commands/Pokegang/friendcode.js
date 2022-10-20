// Dependencies
const { Embed } = require('../../utils'),
	{ EmbedBuilder, ApplicationCommandOptionType, PermissionsBitField: { Flags } } = require('discord.js'),
	Command = require('../../structures/Command.js');

/**
 * Meme command
 * @extends {Command}
*/
class Friendcode extends Command {
	/**
 	 * @param {Client} client The instantiating client
 	 * @param {CommandData} data The data for the command
	*/
	constructor(bot) {
		super(bot, {
			name: 'friendcode',
			name_localizations: {
				de: 'freundescode',
			},
			aliases: ['fc'],
			guildOnly: true,
			dirname: __dirname,
			botPermissions: [Flags.SendMessages, Flags.EmbedLinks],
			description: 'Friendcode',
			description_localizations: {
				de: 'Freundescode',
			},
			usage: 'friendcode',
			cooldown: 1000,
			slash: true,
			options: [
				{
					name: 'add',
					description: 'add fc',
					type: ApplicationCommandOptionType.Subcommand,
				},
				{
					name: 'delete',
					description: 'delete fc',
					type: ApplicationCommandOptionType.Subcommand,
				},
				{
					name: 'show',
					description: 'show fc',
					type: ApplicationCommandOptionType.Subcommand,
				},
			],
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
 	 * @readonly
	*/
	async callback(bot, interaction, guild, args) {
		const command = bot.commands.get(`fc-${interaction.options.getSubcommand()}`);
		if (command) {
			command.callback(bot, interaction, guild, args);
		} else {
			interaction.reply({ content: 'Error' });
		}
	}

}

module.exports = Friendcode;
