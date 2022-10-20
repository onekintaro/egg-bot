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
const fetch = require('node-fetch');
class PokedexFunctions {
    constructor(bot, message, help, msg) {
        this.bot = bot;
        this.message = message;
        this.help = help;
        this.msg = msg;
    }
    getMatch(a, b) {
        let matches = [];
        for (let i = 0; i < a.length; i++) {
            for (let e = 0; e < b.length; e++) {
                if (a[i].name === b[e].name)
                    matches.push(a[i]);
            }
        }
        return matches;
    }
    removeMatch(a, b) {
        let matches = [];
        matches = Object.assign(a.double_damage_from, b.double_damage_from);
        return matches;
    }
    compareTypes(a, b) {
        let four_damage_from = this.getMatch(a.double_damage_from, b.double_damage_from);
        let double_damage_from = this.removeMatch(a, b);
        let normal_damage_from = this.getMatch(a.double_damage_from, b.half_damage_from);
        let half_damage_from = [];
        let quarter_damage_from = this.getMatch(a.half_damage_from, b.half_damage_from);
        let no_damage_from = this.getMatch(a.no_damage_from, b.no_damage_from);
        let matches = { four_damage_from, double_damage_from, normal_damage_from, half_damage_from, quarter_damage_from, no_damage_from };
        return matches;
    }
    padZero(id, zero = 4) {
        if (id == 0) {
            return '????';
        }
        else {
            return String(id).padStart(zero, '0');
        }
    }
    getName(names, en = false) {
        let found;
        if (names == '???') {
            return 'Unbekanntes Pokémon';
        }
        if (en) {
            found = names.find(element => element.language.name == 'en');
            if (found !== undefined) {
                return found.name;
            }
            else {
                return 'Unbekanntes Pokémon';
            }
        }
        found = names.find(element => element.language.name == 'de');
        if (found !== undefined) {
            return found.name;
        }
        else {
            found = names.find(element => element.language.name == 'en');
            if (found !== undefined) {
                return found.name;
            }
            else {
                return 'Unbekanntes Pokémon';
            }
        }
    }
    getSpecies(genera) {
        if (genera == '???') {
            return 'Unbekannte Spezies';
        }
        let found = genera.find(element => element.language.name == 'de');
        if (found !== undefined) {
            return found.genus;
        }
        else {
            found = genera.find(element => element.language.name == 'en');
            if (found !== undefined) {
                return found.genus;
            }
            else {
                return 'Unbekannte Spezies';
            }
        }
    }
    gameDe(game) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield fetch(game.url).then(info => {
                    if (info.ok) {
                        return info.json();
                    }
                    else {
                        return {
                            id: 0,
                            names: '???',
                        };
                    }
                });
                if (res.names == '???') {
                    return 'Unbekannt';
                }
                let found = res.names.find(element => element.language.name == 'de');
                if (found !== undefined) {
                    return found.name;
                }
                else {
                    found = res.names.find(element => element.language.name == 'en');
                    if (found !== undefined) {
                        return found.name;
                    }
                    else {
                        return 'Unbekannt';
                    }
                }
            }
            catch (err) {
                // An error occured when looking for account
                if (this.message.deletable)
                    this.message.delete();
                this.bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
                return this.message.channel.error('misc:ERROR_MESSAGE', { ERROR: err.message });
            }
        });
    }
    getDex(dex) {
        return __awaiter(this, void 0, void 0, function* () {
            if (dex == '???') {
                return '**[NO DATA]**';
            }
            let found = dex.filter(element => element.language.name == 'de');
            let findex = Math.floor(Math.random() * found.length);
            if (found !== undefined) {
                return found[findex].flavor_text + '\n ***Eintrag aus Pokémon ' + (yield this.gameDe(found[findex].version)) + '***';
            }
            else {
                found = dex.filter(element => element.language.name == 'en');
                findex = Math.floor(Math.random() * found.length);
                if (found !== undefined) {
                    return found.flavor_text + '\n ***Eintrag aus Pokémon ' + (yield this.gameDe(found.version)) + '***';
                }
                else {
                    return '**[NO DATA]**';
                }
            }
        });
    }
    getLinks(data) {
        if (data.names == '???' || data.id == 0) {
            return 'No Links Found';
        }
        else {
            return `[Pokéwiki](https://www.pokewiki.de/${this.getName(data.names)}) | [Bisafans](https://www.bisafans.de/pokedex/${this.padZero(data.id, 3)}.php) | [Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/${this.getName(data.names, true)}_(Pokémon))`;
        }
    }
    typeEmoji(type) {
        switch (type) {
            case 'bug':
                return '<:typebug:1028549287543582740>';
            case 'dark':
                return '<:typedark:1028549288797687808>';
            case 'dragon':
                return '<:typedragon:1028549290106290246>';
            case 'electric':
                return '<:typeelectric:1028549291331043338>';
            case 'fairy':
                return '<:typefairy:1028549292476088401>';
            case 'fighting':
                return '<:typefighting:1028549293742764072>';
            case 'fire':
                return '<:typefire:1028549295030407168>';
            case 'flying':
                return '<:typeflying:1028549296393564226> ';
            case 'ghost':
                return '<:typeghost:1028549297853169714>';
            case 'grass':
                return '<:typegrass:1028549299476369448>';
            case 'ground':
                return '<:typeground:1028549301649035264>';
            case 'ice':
                return '<:typeice:1028549302970232863>';
            case 'normal':
                return '<:typenormal:1028549304178200577>';
            case 'poison':
                return '<:typepoison:1028549305503580223>';
            case 'psychic':
                return '<:typepsychic:1028549307235827772>';
            case 'rock':
                return '<:typerock:1028549308712235048>';
            case 'steel':
                return '<:typesteel:1028549311669215232>';
            case 'water':
                return '<:typewater:1028549314559086613>';
            case 'unknown':
                return '<:typeunknown:1028549313057538118>';
            case 'shadow':
                return '<:typeshadow:1028549309756616835>';
            default:
                return '<:typeunknown:1028549313057538118>';
        }
    }
    getTypes(types) {
        if (types == '???') {
            return this.typeEmoji('unknown');
        }
        if (types[0] == undefined) {
            return this.typeEmoji('unknown');
        }
        else if (types[1] == undefined) {
            return this.typeEmoji(types[0].type.name);
        }
        else {
            return this.typeEmoji(types[0].type.name) + ' ' + this.typeEmoji(types[1].type.name);
        }
    }
    getWeakdata(type, to = false) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let doubleFrom = '';
                let doubleTo = '';
                let halfFrom = '';
                let halfTo = '';
                let noFrom = '';
                let noTo = '';
                const res = yield fetch('https://pokeapi.co/api/v2/type/' + type).then(data => {
                    if (data.ok) {
                        return data.json();
                    }
                    else {
                        return {
                            damage_relations: '???',
                        };
                    }
                });
                if (res.damage_relations == '???') {
                    return '\nSchwächen: ' + this.typeEmoji('unknown');
                }
                if (res.damage_relations.double_damage_from.length !== 0) {
                    doubleFrom = '\nAnfällig (2x): ' + res.damage_relations.double_damage_from.map(element => {
                        return this.typeEmoji(element.name);
                    }).join(' ');
                }
                if (res.damage_relations.half_damage_from.length !== 0) {
                    halfFrom = '\nResistent (½x): ' + res.damage_relations.half_damage_from.map(element => {
                        return this.typeEmoji(element.name);
                    }).join(' ');
                }
                if (res.damage_relations.no_damage_from.length !== 0) {
                    noFrom = '\nImmun (0x): ' + res.damage_relations.no_damage_from.map(element => {
                        return this.typeEmoji(element.name);
                    }).join(' ');
                }
                if (res.damage_relations.double_damage_to.length !== 0) {
                    doubleTo = '\nEffektiv (2x): ' + res.damage_relations.double_damage_to.map(element => {
                        return this.typeEmoji(element.name);
                    }).join(' ');
                }
                if (res.damage_relations.half_damage_to.length !== 0) {
                    halfTo = '\nSchwach (½x): ' + res.damage_relations.half_damage_to.map(element => {
                        return this.typeEmoji(element.name);
                    }).join(' ');
                }
                if (res.damage_relations.no_damage_to.length !== 0) {
                    noTo = '\nWirkungslos (0x): ' + res.damage_relations.no_damage_to.map(element => {
                        return this.typeEmoji(element.name);
                    }).join(' ');
                }
                if (!to) {
                    return doubleFrom + halfFrom + noFrom;
                }
                else {
                    return doubleFrom + halfFrom + noFrom + '\n' + doubleTo + halfTo + noTo;
                }
            }
            catch (err) {
                // An error occured when looking for account
                if (this.message.deletable)
                    this.message.delete();
                this.bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
                return this.message.channel.error('misc:ERROR_MESSAGE', { ERROR: err.message });
            }
        });
    }
    getDoubleWeakdata(type1, type2) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let doubleFrom = '';
                let doubleTo = '';
                let halfFrom = '';
                let halfTo = '';
                let noFrom = '';
                let noTo = '';
                const res1 = yield fetch('https://pokeapi.co/api/v2/type/' + type1).then(data => {
                    if (data.ok) {
                        return data.json();
                    }
                    else {
                        return {
                            damage_relations: '???',
                        };
                    }
                });
                const res2 = yield fetch('https://pokeapi.co/api/v2/type/' + type2).then(data => {
                    if (data.ok) {
                        return data.json();
                    }
                    else {
                        return {
                            damage_relations: '???',
                        };
                    }
                });
                if (res1.damage_relations == '???' || res2.damage_relations == '???') {
                    return '\nSchwächen: ' + this.typeEmoji('unknown');
                }
                else {
                    let damage_relations = this.compareTypes(res1.damage_relations, res2.damage_relations);
                    console.log(damage_relations);
                }
                // if(res.damage_relations.double_damage_from.length !== 0) {
                // 	doubleFrom = '\nAnfällig (2x): ' + res.damage_relations.double_damage_from.map(element => {
                // 		return this.typeEmoji(element.name);
                // 	}).join(' ');
                // }
                // if(res.damage_relations.half_damage_from.length !== 0) {
                // 	halfFrom = '\nResistent (½x): ' + res.damage_relations.half_damage_from.map(element => {
                // 		return this.typeEmoji(element.name);
                // 	}).join(' ');
                // }
                // if(res.damage_relations.no_damage_from.length !== 0) {
                // 	noFrom = '\nImmun (0x): ' + res.damage_relations.no_damage_from.map(element => {
                // 		return this.typeEmoji(element.name);
                // 	}).join(' ');
                // }
                // if(res.damage_relations.double_damage_to.length !== 0) {
                // 	doubleTo = '\nEffektiv (2x): ' + res.damage_relations.double_damage_to.map(element => {
                // 		return this.typeEmoji(element.name);
                // 	}).join(' ');
                // }
                // if(res.damage_relations.half_damage_to.length !== 0) {
                // 	halfTo = '\nSchwach (½x): ' + res.damage_relations.half_damage_to.map(element => {
                // 		return this.typeEmoji(element.name);
                // 	}).join(' ');
                // }
                // if(res.damage_relations.no_damage_to.length !== 0) {
                // 	noTo = '\nWirkungslos (0x): ' + res.damage_relations.no_damage_to.map(element => {
                // 		return this.typeEmoji(element.name);
                // 	}).join(' ');
                // }
                // if(!to) {
                // 	return doubleFrom + halfFrom + noFrom;
                // } else {
                // 	return doubleFrom + halfFrom + noFrom + '\n' + doubleTo + halfTo + noTo;
                // }
            }
            catch (err) {
                // An error occured when looking for account
                if (this.message.deletable)
                    this.message.delete();
                this.bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
                return this.message.channel.error('misc:ERROR_MESSAGE', { ERROR: err.message });
            }
        });
    }
    getWeakness(types, to = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (types == '???') {
                return '';
            }
            if (types[0] == undefined) {
                return '';
            }
            else if (types[1] == undefined) {
                return yield this.getWeakdata(types[0].type.name, to);
            }
            else {
                return yield this.getDoubleWeakdata(types[0].type.name, types[1].type.name, to);
            }
        });
    }
}
module.exports = PokedexFunctions;
