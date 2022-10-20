module.exports = async (bot) => {
	// get list of channel ID's
	const channelIDs = Array.from(bot.embedCollection.keys());

	// loop through each channel ID sending their embeds
	for (const channelId of channelIDs) {
		const channel = await bot.channels.cache.get(channelId);

		try {
			const webhooks = await channel.fetchWebhooks();
			let webhook = webhooks.find(wh => wh.token);

			// create webhook if it doesn't exist
			if (!webhook) {
				console.log('No webhook was found that I can use!');
				await channel.createWebhook({
					name: bot.user.username,
					avatar: bot.user.displayAvatarURL({ format: 'png', size: 1024 }),
				})
					.then(wh => {
						console.log(`Created webhook ${wh}`);
						webhook = wh;
					})
					.catch(console.error);
			}


			// send the embeds
			const repeats = Math.ceil(bot.embedCollection.get(channelId).length / 10);
			for (let j = 0; j < repeats; j++) {
				// Get embeds and files to upload via webhook
				const embeds = bot.embedCollection.get(channelId)?.slice(j * 10, (j * 10) + 10).map(f => f[0]);
				const files = bot.embedCollection.get(channelId)?.slice(j * 10, (j * 10) + 10).map(f => f[1]).filter(e => e != undefined);
				if (!embeds) return;

				// send webhook message

				await webhook.send({
					embeds: embeds,
					files: files,
				});
			}
			// delete from collection once sent
			bot.embedCollection.delete(channelId);
		} catch (err) {
			// It was likely they didn't have permission to create/send the webhook
			bot.logger.error(err.message);
			bot.embedCollection.delete(channelId);
		}
	}
};
