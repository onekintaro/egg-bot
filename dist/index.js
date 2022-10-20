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
const { logger } = require('./utils');
(() => __awaiter(void 0, void 0, void 0, function* () {
    // This is to verify the config file
    const configCorrect = yield require('./scripts/verify-config.js').run(require('./config.js'));
    if (!configCorrect) {
        // This file is for sharding
        const { ShardingManager } = require('discord.js');
        // Create sharding manager
        const manager = new ShardingManager('./src/bot.js', {
            // Sharding options
            totalShards: 'auto',
            token: require('./config.js').token,
        });
        // Spawn your shards
        logger.log('=-=-=-=-=-=-=- Loading shard(s) -=-=-=-=-=-=-=');
        try {
            yield manager.spawn();
        }
        catch (err) {
            logger.error(`Error loading shards: ${err.message}`);
        }
        // Emitted when a shard is created
        manager.on('shardCreate', (shard) => {
            logger.log(`Shard ${shard.id} launched`);
        });
    }
    else {
        logger.error('Please fix your errors before loading the bot.');
        process.exit();
    }
}))();
