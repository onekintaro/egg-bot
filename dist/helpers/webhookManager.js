"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
module.exports = (bot) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    // get list of channel ID's
    const channelIDs = Array.from(bot.embedCollection.keys());
    // loop through each channel ID sending their embeds
    for (const channel of channelIDs) {
        try {
            const webhooks = yield bot.channels.fetch(channel).then(c => c.fetchWebhooks());
            let webhook = webhooks.find(wh => wh.name == bot.user.username);
            // create webhook if it doesn't exist
            if (!webhook) {
                webhook = yield bot.channels.fetch(channel).then(c => c.createWebhook(bot.user.username, {
                    avatar: bot.user.displayAvatarURL({ format: 'png', size: 1024 }),
                }));
            }
            // send the embeds
            const repeats = Math.ceil(bot.embedCollection.get(channel).length / 10);
            for (let j = 0; j < repeats; j++) {
                // Get embeds and files to upload via webhook
                const embeds = (_a = bot.embedCollection.get(channel)) === null || _a === void 0 ? void 0 : _a.slice(j * 10, (j * 10) + 10).map(f => f[0]);
                const files = (_b = bot.embedCollection.get(channel)) === null || _b === void 0 ? void 0 : _b.slice(j * 10, (j * 10) + 10).map(f => f[1]).filter(e => e != undefined);
                if (!embeds)
                    return;
                // send webhook message
                yield webhook.send({
                    embeds: embeds,
                    files: files,
                });
            }
            // delete from collection once sent
            bot.embedCollection.delete(channel);
        }
        catch (err) {
            // It was likely they didn't have permission to create/send the webhook
            bot.logger.error(err.message);
            bot.embedCollection.delete(channel);
        }
    }
});
