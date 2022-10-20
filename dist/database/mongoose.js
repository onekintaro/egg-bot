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
const mongoose = require('mongoose');
module.exports = {
    init: (bot) => {
        const dbOptions = {
            useNewUrlParser: true,
            autoIndex: false,
            connectTimeoutMS: 10000,
            family: 4,
            useUnifiedTopology: true,
        };
        mongoose.connect(bot.config.MongoDBURl, dbOptions);
        mongoose.Promise = global.Promise;
        mongoose.connection.on('connected', () => {
            bot.logger.ready('MongoDB successfully connected');
        });
        mongoose.connection.on('err', (err) => {
            bot.logger.error(`MongoDB has encountered an error: \n ${err.stack}`);
        });
        mongoose.connection.on('disconnected', () => {
            bot.logger.error('MongoDB disconnected');
        });
    },
    ping() {
        return __awaiter(this, void 0, void 0, function* () {
            const currentNano = process.hrtime();
            yield mongoose.connection.db.command({ ping: 1 });
            const time = process.hrtime(currentNano);
            return (time[0] * 1e9 + time[1]) * 1e-6;
        });
    },
};
