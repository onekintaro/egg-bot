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
const express = require('express'), app = express(), { API } = require('../config'), { promisify } = require('util'), readdir = promisify(require('fs').readdir), cors = require('cors');
module.exports = (bot) => __awaiter(void 0, void 0, void 0, function* () {
    const routes = (yield readdir('./src/http/routes')).filter((v, i, a) => a.indexOf(v) === i), endpoints = [];
    // IP logger
    app.use(function (req, res, next) {
        if (req.originalUrl !== '/favicon.png' || bot.config.debug) {
            bot.logger.log(`IP: ${req.connection.remoteAddress.slice(7)} -> ${req.originalUrl}`);
        }
        next();
    });
    // Token system
    app.use((req, res, next) => {
        if (API.secure && API.token !== req.query.token) {
            return res.json({ error: 'Invalid API token' });
        }
        next();
    });
    // Get all routes
    for (const route of routes) {
        if (route !== 'index.js') {
            app.use(`/${route.replace('.js', '')}`, require(`./routes/${route}`)(bot));
            endpoints.push(`${route.replace('.js', '')}:`, ...(require(`./routes/${route}`)(bot).stack.map(item => `\t ${item.route.path}`).filter((v, i, a) => a.indexOf(v) === i && v !== '/')));
        }
    }
    // Create web server
    app
        .use(cors())
        .disable('x-powered-by')
        .get('/', (req, res) => {
        res
            .type('text/plain')
            .send([
            `API server for ${bot.user.tag}`,
            'Endpoints:',
            endpoints.join('\n'),
        ].join('\n'));
    })
        // Make sure web scrapers aren't used
        .get('/robots.txt', function (req, res) {
        res
            .type('text/plain')
            .send('User-agent: *\ndisallow: /');
    })
        .get('*', function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.send('No data here. Go away!');
        });
    })
        // Run the server
        .listen(API.port, () => {
        bot.logger.ready(`Statistics API has loaded on port:${API.port}`);
    })
        .on('error', (err) => {
        bot.logger.error(`Error with starting HTTP API: ${err.message}`);
    });
});
