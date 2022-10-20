// Dependencies
const	{REST, Routes, PermissionsBitField: { Flags } } = require('discord.js'),
	Command = require('../../structures/Command.js');

/**
 * Shutdown command
 * @extends {Command}
*/
class Shutdown extends Command {
	/**
 	 * @param {Client} client The instantiating client
 	 * @param {CommandData} data The data for the command
	*/
	constructor(bot) {
		super(bot, {
			name: 'cleankill',
			ownerOnly: true,
			dirname: __dirname,
			botPermissions: [Flags.SendMessages, Flags.EmbedLinks],
			description: 'Shutdowns the bot. & Clean CMD !DEBUG CMD!',
			usage: 'cleankill',
			cooldown: 3000,
			slash: false,
		});
	}

	/**
	 * Function for receiving message.
	 * @param {bot} bot The instantiating client
 	 * @param {message} message The message that ran the command
 	 * @readonly
	*/
	async run(bot, message) {
		// try and shutdown the server
		try {
			await message.channel.success('🎵🎶***Killing me Softly...***🎶🎵 \n and clean all CMDs. \n\nK THX BYE! See Ya👋');
			await bot.logger.log(`Bot was shutdown by ${message.author.tag} in server: [${message.guild.id}]`);

			await bot.logger.log('Connect API..');
			const rest = await new REST({ version: '10' }).setToken(bot.config.token);

			// const enabledPlugins = guild.settings.plugins;
			const clientId = await bot.user.id;
			const guildId = await message.guild.id;

			// for guild-based commands
			await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] })
				.then(() => bot.logger.log('Successfully deleted all guild commands.'))
				.catch(console.error);

			await bot.destroy();
			process.exit();
		} catch(err) {
			if (message.deletable) message.delete();
			bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
			message.channel.error('misc:ERROR_MESSAGE', { ERROR: err.message });
		}
	}

	/**
	 * Function for receiving interaction.
	 * @param {bot} bot The instantiating client
	 * @param {interaction} interaction The interaction that ran the command
	 * @param {guild} guild The guild the interaction ran in
	 * @readonly
	*/
	async callback(bot, interaction, guild) {
		const channel = guild.channels.cache.get(interaction.channelId);
		try {
			await interaction.reply({ embeds: [channel.success('host/shutdown:success', null, true)] });
			await bot.logger.log(`Bot was shutdown by ${interaction.user.tag} in server: [${guild.id}]`);
			await bot.destroy();
			process.exit();
		} catch(err) {
			bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
			interaction.reply({ embeds: [channel.error('misc:ERROR_MESSAGE', { ERROR: err.message }, true)] });
		}
	}
}

module.exports = Shutdown;
