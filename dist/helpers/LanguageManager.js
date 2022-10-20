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
const i18next = require('i18next'), Backend = require('i18next-node-fs-backend'), path = require('path'), fs = require('fs').promises;
function walkDirectory(dir, namespaces = [], folderName = '') {
    return __awaiter(this, void 0, void 0, function* () {
        const files = yield fs.readdir(dir);
        const languages = [];
        for (const file of files) {
            const stat = yield fs.stat(path.join(dir, file));
            if (stat.isDirectory()) {
                const isLanguage = file.includes('-');
                if (isLanguage)
                    languages.push(file);
                const folder = yield walkDirectory(path.join(dir, file), namespaces, isLanguage ? '' : `${file}/`);
                namespaces = folder.namespaces;
            }
            else {
                namespaces.push(`${folderName}${file.substr(0, file.length - 5)}`);
            }
        }
        return { namespaces: [...new Set(namespaces)], languages };
    });
}
module.exports = () => __awaiter(void 0, void 0, void 0, function* () {
    const options = {
        jsonIndent: 2,
        loadPath: path.resolve(__dirname, '../languages/{{lng}}/{{ns}}.json'),
    };
    const { namespaces, languages } = yield walkDirectory(path.resolve(__dirname, '../languages/'));
    i18next.use(Backend);
    yield i18next.init({
        backend: options,
        debug: false,
        fallbackLng: 'en-US',
        initImmediate: false,
        interpolation: { escapeValue: false },
        load: 'all',
        ns: namespaces,
        preload: languages,
    });
    require('../utils/Logger').ready(`${languages.length} language(s) have loaded. (${languages.join(', ')})`);
    return new Map(languages.map(item => [item, i18next.getFixedT(item)]));
});
