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
// Dependencies
const express = require('express'), router = express.Router();
module.exports = (bot) => {
    // statistics page
    router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        res.status(200).json({
            guildCount: bot.guilds.cache.size,
            cachedUsers: bot.users.cache.size,
            totalMembers: bot.guilds.cache.map(g => g).reduce((a, b) => a + b.memberCount, 0),
            uptime: Math.round(process.uptime() * 1000),
            commandCount: bot.commands.size,
            memoryUsed: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2),
            textChannels: bot.channels.cache.filter(({ type }) => type === 'GUILD_TEXT').size,
            voiceChannels: bot.channels.cache.filter(({ type }) => type === 'GUILD_VOICE').size,
            MessagesSeen: bot.messagesSent,
            CommandsRan: bot.commandsUsed,
            ping: Math.round(bot.ws.ping),
            // Lavalink: bot.manager.nodes.map(node => ({
            // 	name: node.options.identifier,
            // 	stats: node.stats,
            // })),
        });
    }));
    return router;
};
