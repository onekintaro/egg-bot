/* eslint-disable no-inline-comments */
const enableReactionRoles = false;

const reactionRolesChannel = '1027225078972289185';

const reactionRolesConfig = [
	// Platform
	{ messageId: '1030756216906989569', reaction: '1030784118977470595', roleId: '1023956835616702550' }, // Switch
	{ messageId: '1030756216906989569', reaction: '1030784133250699364', roleId: '1023956969477918791' }, // PoGo

	// Main Games SW
	{ messageId: '', reaction: '', roleId: '1030935136545546370' }, // Pokémon Home
	{ messageId: '', reaction: '', roleId: '1030937003006644245' }, // Pokémon Scarlet
	{ messageId: '', reaction: '', roleId: '1030937006118813696' }, // Pokémon Violet
	{ messageId: '', reaction: '', roleId: '1030935008082415676' }, // Pokémon Sword
	{ messageId: '', reaction: '', roleId: '1030935460735889414' }, // Pokémon Shield
	{ messageId: '', reaction: '', roleId: '1030935173090517002' }, // Pokémon Legends Arceus
	{ messageId: '', reaction: '', roleId: '1030935758560841748' }, // Pokémon Let's Go Pikachu
	{ messageId: '', reaction: '', roleId: '1030935356884918313' }, // Pokémon Let's Go Eevee
	{ messageId: '', reaction: '', roleId: '1030936569814712540' }, // Pokémon Brilliant Diamond
	{ messageId: '', reaction: '', roleId: '1030936573094666273' }, // Pokémon Shining Pearl

	// Spinoff Games SW
	{ messageId: '', reaction: '', roleId: '1030936747439304885' }, // Pokémon Snap
	{ messageId: '', reaction: '', roleId: '1030936784437252266' }, // Pokémon Unite
	{ messageId: '', reaction: '', roleId: '1030937562145095740' }, // Pokémon Mystery Dungeon RT DX

	// Niantic Games
	{ messageId: '', reaction: '', roleId: '1030933401626214523' }, // Pikmin Bloom
	{ messageId: '', reaction: '', roleId: '1030933947623944283' }, // Ingress Prime
	{ messageId: '', reaction: '', roleId: '1031134397165998110' }, // Niantic Campfire

	// Ping Roles
	{ messageId: '', reaction: '', roleId: '1030927418262835210' }, // Giveaways
	{ messageId: '', reaction: '', roleId: '1030929602509537391' }, // CM Treffen
	{ messageId: '', reaction: '', roleId: '1030929738463723551' }, // Pokegang News & Updates
	{ messageId: '', reaction: '', roleId: '1030929875315478623' }, // Pokémon News
	{ messageId: '', reaction: '', roleId: '1030939299732000779' }, // Pokémon News Spoiler
	{ messageId: '', reaction: '', roleId: '1030930179842908191' }, // Pokémon Events
	{ messageId: '', reaction: '', roleId: '1030931010466091078' }, // Pokémon Serialcodes
	{ messageId: '', reaction: '', roleId: '1030929904524595341' }, // PoGo News
	{ messageId: '', reaction: '', roleId: '1030930176852377621' }, // PoGo Events
	{ messageId: '', reaction: '', roleId: '1030930171957624842' }, // PoGo Raids

	// Interess Roles
	{ messageId: '', reaction: '', roleId: '1031137922918907914' }, // Story
	{ messageId: '', reaction: '', roleId: '1031137982788419645' }, // Play Together
	{ messageId: '', reaction: '', roleId: '1031138024647565352' }, // Trading
	{ messageId: '', reaction: '', roleId: '1031138064287940608' }, // Catch 'em All
	{ messageId: '', reaction: '', roleId: '1031138129106710568' }, // 100% Run
	{ messageId: '', reaction: '', roleId: '1030936013754880111' }, // VGC / Turniere
	{ messageId: '', reaction: '', roleId: '1030934348989485217' }, // Challenges

	// Time
	{ messageId: '', reaction: '', roleId: '' }, // Morning
	{ messageId: '', reaction: '', roleId: '' }, // Noon
	{ messageId: '', reaction: '', roleId: '' }, // Evening
	{ messageId: '', reaction: '', roleId: '' }, // Night

	// Country
	{ messageId: '', reaction: '', roleId: '1030923882854633593' }, // Country CH
	{ messageId: '', reaction: '', roleId: '1030924059225104474' }, // Country DE
	{ messageId: '', reaction: '', roleId: '1030924229014737006' }, // Country AT
	{ messageId: '', reaction: '', roleId: '1030924270483804181' }, // Country LI
	{ messageId: '', reaction: '', roleId: '1030924375802781706' }, // Country Other

	// Canton
	{ messageId: '', reaction: '', roleId: '1030924724861157488' }, // Canton AG
	{ messageId: '', reaction: '', roleId: '1030924736164806716' }, // Canton AI
	{ messageId: '', reaction: '', roleId: '1030924899121905694' }, // Canton AR
	{ messageId: '', reaction: '', roleId: '1030924909288894545' }, // Canton BE
	{ messageId: '', reaction: '', roleId: '1030924911868395590' }, // Canton BL
	{ messageId: '', reaction: '', roleId: '1030924914565320724' }, // Canton BS
	{ messageId: '', reaction: '', roleId: '1030924916754755625' }, // Canton FR
	{ messageId: '', reaction: '', roleId: '1030925339599314965' }, // Canton GE
	{ messageId: '', reaction: '', roleId: '1030925343512604852' }, // Canton GL
	{ messageId: '', reaction: '', roleId: '1030925347232948294' }, // Canton GR
	{ messageId: '', reaction: '', roleId: '1030925351204954342' }, // Canton JU
	{ messageId: '', reaction: '', roleId: '1030925359786491964' }, // Canton LU
	{ messageId: '', reaction: '', roleId: '1030925367130722324' }, // Canton NE
	{ messageId: '', reaction: '', roleId: '1030925376559530116' }, // Canton NW
	{ messageId: '', reaction: '', roleId: '1030925387095609405' }, // Canton OW
	{ messageId: '', reaction: '', roleId: '1030925872938627252' }, // Canton SG
	{ messageId: '', reaction: '', roleId: '1030925878022119464' }, // Canton SH
	{ messageId: '', reaction: '', roleId: '1030925882350637110' }, // Canton SO
	{ messageId: '', reaction: '', roleId: '1030925887371235408' }, // Canton SZ
	{ messageId: '', reaction: '', roleId: '1030926168020504606' }, // Canton TG
	{ messageId: '', reaction: '', roleId: '1030926171057164338' }, // Canton TI
	{ messageId: '', reaction: '', roleId: '1030926179764535396' }, // Canton UR
	{ messageId: '', reaction: '', roleId: '1030926185691095180' }, // Canton VD
	{ messageId: '', reaction: '', roleId: '1030926408521892023' }, // Canton VS
	{ messageId: '', reaction: '', roleId: '1030926426477703228' }, // Canton ZG
	{ messageId: '', reaction: '', roleId: '1030926429547921469' }, // Canton ZH
];

module.exports = { reactionRolesConfig, reactionRolesChannel, enableReactionRoles };
