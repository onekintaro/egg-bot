const { REST, Routes, PermissionsBitField: { Flags: PermissionFlag } } = require('discord.js');
const config = require('../config');
const { logger } = require('../utils');
const path = require('path');
const { promisify } = require('util');
const readdir = promisify(require('fs').readdir);

module.exports.run = async () => {

	logger.log('=-=-=-=-=-=-=- Reload Commands -=-=-=-=-=-=-=');

	logger.log('Connect API..');
	const rest = new REST({ version: '10' }).setToken(config.token);

	// const enabledPlugins = guild.settings.plugins;
	const clientId = '1027190316551385158';
	const guildId = '696458513949393028';

	// for guild-based commands
	rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] })
		.then(() => logger.log('Successfully deleted all guild commands.'))
		.catch(console.error);

	// const commandArray = await loadInteractionGroup('Pokegang');
	// if(commandArray === Array)return 'failed';
	// (async () => {
	// 	try {
	// 		console.log('Started refreshing application (/) commands.');

	// 		await rest.put(
	// 			Routes.applicationGuildCommands(clientId, guildId),
	// 			{ body: commandArray },
	// 		);

	// 		console.log('Successfully reloaded application (/) commands.');
	// 	} catch (error) {
	// 		console.error(error);
	// 	}
	// })();

	return 'complete';
};

function restartProcess() {
	spawn(process.argv[1], process.argv.slice(2), {
		detached: true,
		stdio: ['ignore', process.stdout, process.stderr],
	}).unref();
	process.exit();
}