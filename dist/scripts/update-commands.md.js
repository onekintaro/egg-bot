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
const fs = require('fs');
module.exports.run = (bot) => __awaiter(void 0, void 0, void 0, function* () {
    const content = [
        '# Command list',
        '><> = required, [] = optional',
        ''
    ];
    // Get list of categories
    try {
        const categories = (bot.commands.map(c => '## ' + c.help.category).filter((v, i, a) => a.indexOf(v) === i));
        categories
            .sort((a, b) => a.category - b.category)
            .forEach(category => {
            const co = bot.commands
                .filter(c => c.help.category === category.slice(3))
                .sort((a, b) => a.help.name - b.help.name)
                .map(c => `| ${c.help.name}	|	${c.help.description}	|	\`${c.help.usage}\`	|`).join('\n');
            content.push(category, '|	Command	| description	| Usage', '|---------------|--------------------|--------------|', co, '\n');
        });
        // read to file
        fs.writeFileSync('./docs/COMMANDS.md', content.join('\n'));
        return 'complete';
    }
    catch (e) {
        return e;
    }
});
