// Dependencies
const { ApplicationCommandOptionType, PermissionsBitField: { Flags } } = require('discord.js'),
	Command = require('../../structures/Command.js');
const { EmbedBuilder } = require('discord.js');

/**
 * Giveaway start command
 * @extends {Command}
*/
class Giveaway extends Command {
	/**
   * @param {Client} client The instantiating client
   * @param {CommandData} data The data for the command
  */
	constructor(bot) {
		super(bot, {
			name: 'giveaway',
			guildOnly: true,
			dirname: __dirname,
			userPermissions: [Flags.ManageGuild],
			botPermissions: [Flags.SendMessages, Flags.EmbedLinks, Flags.AddReactions],
			description: 'Interact with the giveaway commands',
			usage: 'giveaway start <time> <Number of winners> <prize>',
			cooldown: 30000,
			examples: ['giveaway start 1m 1 nitro', 'giveaway reroll 1021725995901911080'],
			slash: true,
			options: bot.commands.filter(c => c.help.category == 'Giveaway' && c.help.name !== 'giveaway').map(c => ({
				name: c.help.name.replace('g-', ''),
				description: c.help.description,
				type: ApplicationCommandOptionType.Subcommand,
				options: c.conf.options,
			})),
		});
	}

	async run(bot, message, settings) {
		// send 'waiting' message to show bot has recieved message
		const msg = await message.channel.send(message.translate('misc:FETCHING', {
			EMOJI: message.channel.checkPerm('USE_EXTERNAL_EMOJIS') ? bot.customEmojis['loading'] : '', ITEM: this.help.name }));

		// Retrieve a random meme
		const embed = new EmbedBuilder()
			.setColor(0xFF0000)
			.setTitle('ERROR!')
			.setDescription('This Command needs to be run as Slash Command!')

		// Send the meme to channel
		msg.delete();
		message.channel.send({ embeds: [embed] });
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
		const command = bot.commands.get(`g-${interaction.options.getSubcommand()}`);
		if (command) {
			command.callback(bot, interaction, guild, args);
		} else {
			interaction.reply({ content: 'Error' });
		}
	}
}

module.exports = Giveaway;
