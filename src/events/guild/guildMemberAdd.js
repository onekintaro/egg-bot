// Dependencies
const { Embed } = require('../../utils'),
	varSetter = require('../../helpers/variableSetter'),
	Event = require('../../structures/Event');
const { EmbedBuilder } = require('discord.js');

/**
 * Guild member add event
 * @event Egglord#GuildMemberAdd
 * @extends {Event}
*/
class GuildMemberAdd extends Event {
	constructor(...args) {
		super(...args, {
			dirname: __dirname,
		});
	}

	/**
	 * Function for receiving event.
	 * @param {bot} bot The instantiating client
	 * @param {GuildMember} member The member that has joined a guild
	 * @readonly
	*/
	async run(bot, member) {
	// For debugging
		if (bot.config.debug) bot.logger.debug(`Member: ${member.user.tag} has been joined guild: ${member.guild.id}.`);

		if (member.user.id == bot.user.id) return;

		// Get server settings / if no settings then return
		const settings = member.guild.settings;
		if (Object.keys(settings).length == 0) return;

		// Check if event guildMemberAdd is for logging
		if (settings.ModLogEvents?.includes('GUILDMEMBERADD') && settings.ModLog) {
			const embed = new Embed(bot, member.guild)
				.setDescription(`${member}\nMember count: ${member.guild.memberCount}`)
				.setColor(3066993)
				.setFooter({ text: `ID: ${member.id}` })
				.setThumbnail(member.user.displayAvatarURL())
				.setAuthor({ name: 'User joined:', iconURL: member.user.displayAvatarURL() })
				.setTimestamp();

			// Find channel and send message
			try {
				const modChannel = await bot.channels.fetch(settings.ModLogChannel).catch(() => bot.logger.error(`Error fetching guild: ${member.guild.id} logging channel`));
				if (modChannel && modChannel.guild.id == member.guild.id) bot.addEmbed(modChannel.id, [embed]);
			} catch (err) {
				bot.logger.error(`Event: '${this.conf.name}' has error: ${err.message}.`);
			}
		}

		// Welcome plugin (give roles and message)
		if (settings.welcomePlugin) {
			const channel = member.guild.channels.cache.get(settings.welcomeMessageChannel);
			let sendData;
			const hash = (+new Date * Math.random()).toString(36).substring(0, 5);
			const welcomeEmbed = new EmbedBuilder()
				.setColor(settings.welcomeMessageEmbed.color)
				.setTitle(settings.welcomeMessageEmbed.title.replace('{user}', member.user.username).replace('{server}', member.guild.name))
				.setDescription(settings.welcomeMessageEmbed.description.replace('{user}', member.user).replace('{server}', member.guild.name))
				.setThumbnail(settings.welcomeMessageEmbed.thumbnail.replace('{hash}', hash))
				.setTimestamp();

			if(!settings.welcomeMessageEmbedToggle) {
				sendData = varSetter(settings.welcomeMessageText, member, channel, member.guild);
			} else {
				sendData = { embeds: [welcomeEmbed] };
			}
			if (channel) {
				bot.on('guildMemberUpdate', (oldMember, newMember) => {
					if (oldMember.pending && !newMember.pending) {
						channel.send(sendData).catch(e => bot.logger.error(e.message));
					}
				});
			}
			// Send private message to user
			if (settings.welcomePrivateToggle) {
				bot.on('guildMemberUpdate', (oldMember, newMember) => {
					if (oldMember.pending && !newMember.pending) {
						member.send(settings.welcomePrivateText.replace('{user}', member.user).replace('{server}', member.guild.name)).catch(e => bot.logger.error(e.message));
					}
				});
			}

			// Add role to user
			try {
				if (settings.welcomeRoleToggle) {
					bot.on('guildMemberUpdate', (oldMember, newMember) => {
						if (oldMember.pending && !newMember.pending) {
							member.roles.add(settings.welcomeRoleGive);
						}
					});
				}
			} catch (err) {
				console.log(settings.welcomeRoleGive);
				bot.logger.error(`Event: '${this.conf.name}' has error: ${err.message}.`);
			}
		}
	}
}

module.exports = GuildMemberAdd;
