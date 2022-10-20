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
        // check for ID query
        if (req.query.ID && req.query.guilds) {
            const guilds = req.query.guilds.split(',');
            yield Promise.all(guilds.map((g) => __awaiter(void 0, void 0, void 0, function* () {
                var _a;
                const gs = yield ((_a = bot.guilds.cache.get(g)) === null || _a === void 0 ? void 0 : _a.members.fetch(req.query.ID));
                if (!gs)
                    guilds.splice(guilds.indexOf(g), 1);
            })));
            res.status(200).json({ guilds });
        }
        else if (req.query.ID && !req.query.guilds) {
            // missing guilds
            res.status(200).json({ error: 'Missing array of guild ID\'s' });
        }
        else {
            res.status(200).json({ error: 'Missing user ID' });
        }
    }));
    return router;
};
