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
const { logger } = require('../utils'), { GuildSchema } = require('../database/models');
module.exports.run = () => __awaiter(void 0, void 0, void 0, function* () {
    logger.log('Updating database');
    try {
        const resp = yield GuildSchema.updateMany({ version: '1.1' }, [
            { $set: { version: '1.2', MutedMembers: [] } },
            { $unset: ['ModerationBadwords', 'ModerationBadwordChannel', 'ModerationBadwordRole', 'ModerationBadwordList',
                    'ModerationRepeatedText', 'ModerationRepeatedTextChannel', 'ModerationRepeatedTextRole', 'ModerationServerInvites',
                    'ModerationServerInvitesChannel', 'ModerationServerInvitesRole', 'ModerationExternalLinks', 'ModerationExternalLinksChannel',
                    'ModerationExternalLinksRole', 'ModerationExternalLinksAllowed', 'ModerationSpammedCaps', 'ModerationSpammedCapsChannel',
                    'ModerationSpammedCapsRole', 'ModerationSpammedCapsPercentage', 'ModerationExcessiveEmojis', 'ModerationExcessiveEmojisChannel',
                    'ModerationExcessiveEmojisRole', 'ModerationExcessiveEmojiPercentage', 'ModerationMassSpoilers', 'ModerationMassSpoilersChannel',
                    'ModerationMassSpoilersRole', 'ModerationMassSpoilersPercentage', 'ModerationMassMention', 'ModerationMassMentionChannel',
                    'ModerationMassMentionRole', 'ModerationMassMentionNumber', 'ModerationZalgo', 'ModerationZalgoChannel', 'ModerationZalgoRole',
                    'ServerStats', 'ServerStatsCate', 'ServerStatsBot', 'ServerStatsBotChannel', 'ServerStatsUse', 'ServerStatsUserChannel',
                    'ServerStatsHuman', 'ServerStatsHumanChannel', 'DisabledCommands', 'AntiRaidPlugin', 'AntiRaidCompletion', 'AntiRaidChannelID',
                    'ReportToggle', 'CommandChannelToggle', 'CommandChannels', 'CommandCooldown', 'CommandCooldownSec', 'MusicTriviaPlugin',
                    'MusicTriviaGenres',
                ] }
        ]);
        logger.ready('Database has been updated to v1.2');
        return resp;
    }
    catch (err) {
        console.log(err);
    }
});
