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
const express = require('express'), fs = require('fs'), router = express.Router();
// Guild page
module.exports = () => {
    // Get basic information on guild
    router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const date = (_a = req.query.date) !== null && _a !== void 0 ? _a : new Date().toLocaleDateString('EN-GB').split('/').reverse().join('.');
        try {
            const data = fs.readFileSync(`${process.cwd()}/src/utils/logs/roll-${date}.log`, 'utf8');
            res.status(200).json({ date, logs: data.split(' \r\n') });
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    }));
    return router;
};
