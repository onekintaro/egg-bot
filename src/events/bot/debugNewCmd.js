// Dependencies
const { EmbedBuilder, AttachmentBuilder, ActivityType } = require('discord.js'),
	{ Canvas } = require('canvacord'),
	Event = require('../../structures/Event');

/**
 * Guild create event
 * @event Egglord#Ready
 * @extends {Event}
*/
class DebugNewCmd extends Event {
	constructor(...args) {
		super(...args, {
			dirname: __dirname,
			once: true,
		});
	}

	/**
	 * Function for receiving event.
	 * @param {bot} bot The instantiating client
	 * @param {Guild} guild The guild that added the bot
	 * @readonly
	*/
	async run(bot) {
		if (bot.config.debug && bot.config.resetCmd) {
			for (const guild of [...bot.guilds.cache.values()]) {
				bot.logger.debug(`[Refresh CMD] ${guild.name} (${guild.id}).`);
				// get slash commands for category
				try {
					// Create guild settings and fetch cache.
					await guild.fetchSettings();
				} catch (err) {
					bot.logger.error(`Event: '${this.conf.name}' has error: ${err.message}.`);
				}
				//console.log(guild.settings);
				const enabledPlugins = guild.settings.plugins;
				const data = [];
				for (const plugin of enabledPlugins) {
					const g = await bot.loadInteractionGroup(plugin, guild);
					if (Array.isArray(g)) data.push(...g);
				}

				try {
					await bot.guilds.cache.get(guild.id)?.commands.set(data);
					bot.logger.log('Loaded Interactions for guild: ' + guild.name);
				} catch (err) {
					bot.logger.error(`Failed to load interactions for guild: ${guild.id} due to: ${err.message}.`);
				}
			}
		}
	}
}

module.exports = DebugNewCmd;
