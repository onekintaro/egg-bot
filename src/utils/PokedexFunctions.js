const fetch = require('node-fetch');
const _ = require('lodash');
const fs = require('fs');
const pokemonTypeNames = require('../assets/json/pokemon-type-names.json');
const pokemonNames = require('../assets/json/pokemon-names.json');

class PokedexFunctions {

	constructor(bot, help) {
		this.bot = bot;
		this.help = help;
	}

	getMatch(a, b) {
		let matches = [];
		// matches = _.differenceBy(a, b, 'name');
		for (let i = 0; i < a.length; i++) {
			for (let e = 0; e < b.length; e++) {
				if (a[i].name === b[e].name) matches.push(a[i]);
			}
		}
		return matches;
	}

	removeMatch(union, remove, double = false) {
		union = _.differenceBy(union, remove.four_damage_from, 'name');
		union = _.differenceBy(union, remove.normal_damage_from, 'name');
		union = _.differenceBy(union, remove.quarter_damage_from, 'name');
		union = _.differenceBy(union, remove.no_damage_from, 'name');
		if(double) {
			union = _.differenceBy(union, remove.half_damage_from, 'name');
		} else {
			union = _.differenceBy(union, remove.double_damage_from, 'name');
		}
		return union;
	}

	compareTypes(a, b) {
		const four_damage_from = this.getMatch(a.double_damage_from, b.double_damage_from);
		let double_damage_from = _.unionBy(a.double_damage_from, b.double_damage_from, 'name');
		const normal_damage_from = this.getMatch(a.double_damage_from, b.half_damage_from);
		let half_damage_from = _.unionBy(a.half_damage_from, b.half_damage_from, 'name');
		const quarter_damage_from = this.getMatch(a.half_damage_from, b.half_damage_from);
		const no_damage_from = _.unionBy(a.no_damage_from, b.no_damage_from, 'name');
		const drem = { four_damage_from, double_damage_from, normal_damage_from, quarter_damage_from, no_damage_from, half_damage_from };

		double_damage_from = this.removeMatch(double_damage_from, drem, true);
		half_damage_from = this.removeMatch(half_damage_from, drem);

		const matches = { four_damage_from, double_damage_from, normal_damage_from, half_damage_from, quarter_damage_from, no_damage_from };
		return matches;
	}


	padZero(id, zero = 4) {
		if(id == 0) {
			return '????';
		} else {
			return String(id).padStart(zero, '0');
		}
	}

	getTypeName(name) {
		name = name.toLowerCase();
		let found;
		pokemonTypeNames.forEach((element, index) => {
			if(element.search.find(ele => ele == name)) {
				found = element;
			}
		});

		if (found !== undefined) {
			return found;
		} else {
			return '???';
		}
	}

	getIdFromName(name) {
		name = name.toLowerCase();
		let found;
		found = pokemonNames.find(element => element.name.toLowerCase() == name);

		if (found !== undefined) {
			return found.pokemon_species_id;
		} else {
			return 0;
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
			} else {
				return 'Unbekanntes Pokémon';
			}
		}
		found = names.find(element => element.language.name == 'de');
		if (found !== undefined) {
			return found.name;
		} else {
			found = names.find(element => element.language.name == 'en');
			if (found !== undefined) {
				return found.name;
			} else {
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
		} else {
			found = genera.find(element => element.language.name == 'en');
			if (found !== undefined) {
				return found.genus;
			} else {
				return 'Unbekannte Spezies';
			}
		}
	}

	async gameDe(game) {
		try {
			const res = await fetch(game.url).then(info => {
				if(info.ok) {
					return info.json();
				} else {
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
			} else {
				found = res.names.find(element => element.language.name == 'en');
				if (found !== undefined) {
					return found.name;
				} else {
					return 'Unbekannt';
				}
			}
		} catch (err) {
			// An error occured when looking for account
			this.bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
		}
	}


	async getDex(dex) {
		if (dex == '???') {
			return '**[NO DATA]**';
		}
		let found = dex.filter(element => element.language.name == 'de');
		let findex = Math.floor(Math.random() * found.length);
		if (found !== undefined) {
			return found[findex].flavor_text + '\n ***Eintrag aus Pokémon ' + await this.gameDe(found[findex].version) + '***';
		} else {
			found = dex.filter(element => element.language.name == 'en');
			findex = Math.floor(Math.random() * found.length);
			if (found !== undefined) {
				return found.flavor_text + '\n ***Eintrag aus Pokémon ' + await this.gameDe(found.version) + '***';
			} else {
				return '**[NO DATA]**';
			}
		}
	}

	getLinks(data) {
		if(data.names == '???' || data.id == 0) {
			return 'No Links Found';
		} else {
			return `[Pokéwiki](https://www.pokewiki.de/${this.getName(data.names)}) | [Bisafans](https://www.bisafans.de/pokedex/${this.padZero(data.id, 3)}.php) | [Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/${this.getName(data.names, true)}_(Pokémon))`;
		}
	}

	typeEmoji(type) {
		switch(type) {
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
				return '<:typefighting:1029462780161560697>';
			case 'fire':
				return '<:typefire:1028549295030407168>';
			case 'flying':
				return '<:typeflying:1028549296393564226>';
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
		} else if (types[1] == undefined) {
			return this.typeEmoji(types[0].type.name);
		} else {
			return this.typeEmoji(types[0].type.name) + ' ' + this.typeEmoji(types[1].type.name);
		}
	}

	async getWeakdata(type, to = false) {
		try {
			let doubleFrom = '';
			let doubleTo = '';
			let halfFrom = '';
			let halfTo = '';
			let noFrom = '';
			let noTo = '';

			const res = await fetch('https://pokeapi.co/api/v2/type/' + type).then(data => {
				if(data.ok) {
					return data.json();
				} else {
					return {
						damage_relations: '???',
					};
				}
			});
			if (res.damage_relations == '???') {
				return '\nSchwächen: ' + this.typeEmoji('unknown');
			}
			if(res.damage_relations.double_damage_from.length !== 0) {
				doubleFrom = '\nAnfällig (2x): ' + res.damage_relations.double_damage_from.map(element => {
					return this.typeEmoji(element.name);
				}).join(' ');
			}
			if(res.damage_relations.half_damage_from.length !== 0) {
				halfFrom = '\nResistent (½x): ' + res.damage_relations.half_damage_from.map(element => {
					return this.typeEmoji(element.name);
				}).join(' ');
			}
			if(res.damage_relations.no_damage_from.length !== 0) {
				noFrom = '\nImmun (0x): ' + res.damage_relations.no_damage_from.map(element => {
					return this.typeEmoji(element.name);
				}).join(' ');
			}
			if(res.damage_relations.double_damage_to.length !== 0) {
				doubleTo = '\nEffektiv (2x): ' + res.damage_relations.double_damage_to.map(element => {
					return this.typeEmoji(element.name);
				}).join(' ');
			}
			if(res.damage_relations.half_damage_to.length !== 0) {
				halfTo = '\nSchwach (½x): ' + res.damage_relations.half_damage_to.map(element => {
					return this.typeEmoji(element.name);
				}).join(' ');
			}
			if(res.damage_relations.no_damage_to.length !== 0) {
				noTo = '\nWirkungslos (0x): ' + res.damage_relations.no_damage_to.map(element => {
					return this.typeEmoji(element.name);
				}).join(' ');
			}
			if(!to) {
				return doubleFrom + halfFrom + noFrom;
			} else {
				return doubleFrom + halfFrom + noFrom + '\n' + doubleTo + halfTo + noTo;
			}
		} catch (err) {
			this.bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
		}
	}

	async getDoubleWeakdata(type1, type2) {
		try {
			let fourFrom = '';
			let doubleFrom = '';
			let halfFrom = '';
			let quarterFrom = '';
			let noFrom = '';
			let damage_relations;

			const res1 = await fetch('https://pokeapi.co/api/v2/type/' + type1).then(data => {
				if(data.ok) {
					return data.json();
				} else {
					return {
						damage_relations: '???',
					};
				}
			});
			const res2 = await fetch('https://pokeapi.co/api/v2/type/' + type2).then(data => {
				if(data.ok) {
					return data.json();
				} else {
					return {
						damage_relations: '???',
					};
				}
			});

			if (res1.damage_relations == '???' || res2.damage_relations == '???') {
				return '\nSchwächen: ' + this.typeEmoji('unknown');
			} else {
				damage_relations = this.compareTypes(res1.damage_relations, res2.damage_relations);
			}

			if(damage_relations.four_damage_from.length !== 0) {
				fourFrom = '\nAnfällig (4x): ' + damage_relations.four_damage_from.map(element => {
					return this.typeEmoji(element.name);
				}).join(' ');
			}
			if(damage_relations.double_damage_from.length !== 0) {
				doubleFrom = '\nAnfällig (2x): ' + damage_relations.double_damage_from.map(element => {
					return this.typeEmoji(element.name);
				}).join(' ');
			}
			if(damage_relations.half_damage_from.length !== 0) {
				halfFrom = '\nResistent (½x): ' + damage_relations.half_damage_from.map(element => {
					return this.typeEmoji(element.name);
				}).join(' ');
			}
			if(damage_relations.quarter_damage_from.length !== 0) {
				quarterFrom = '\nResistent (¼x): ' + damage_relations.quarter_damage_from.map(element => {
					return this.typeEmoji(element.name);
				}).join(' ');
			}
			if(damage_relations.no_damage_from.length !== 0) {
				noFrom = '\nImmun (0x): ' + damage_relations.no_damage_from.map(element => {
					return this.typeEmoji(element.name);
				}).join(' ');
			}
			return fourFrom + doubleFrom + halfFrom + quarterFrom + noFrom;
		} catch (err) {
			this.bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
		}
	}

	async getWeakness(types, to = false) {
		if (types == '???') {
			return '';
		}
		if (types[0] == undefined) {
			return '';
		} else if (types[1] == undefined) {
			return await this.getWeakdata(types[0].type.name, to);
		} else {
			return await this.getDoubleWeakdata(types[0].type.name, types[1].type.name, to);
		}
	}
}

module.exports = PokedexFunctions;