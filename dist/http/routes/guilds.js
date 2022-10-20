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
// Guild page
module.exports = function (bot) {
    // Get basic information on guild
    router.get('/:guildId', (req, res) => __awaiter(this, void 0, void 0, function* () {
        // fetch guild's basic information
        const guild = bot.guilds.cache.get(req.params.guildId);
        if (guild) {
            const { id, name, icon, members: { size } } = guild;
            const userMembers = guild.members.cache.filter(m => !m.user.bot).size;
            const botMembers = size - userMembers;
            return res.status(200).json({ id, name, icon, totalMembers: size, userMembers, botMembers });
        }
        res.status(400).json({ error: 'Guild not found!' });
    }));
    // Get list of members in guild
    router.get('/:guildId/members', (req, res) => __awaiter(this, void 0, void 0, function* () {
        // fetch member list of guild
        const guild = bot.guilds.cache.get(req.params.guildId);
        if (guild) {
            yield guild.members.fetch();
            // check if an ID query was made
            let members = guild.members.cache.map(member => ({
                user: member.user.username,
                id: member.user.id,
                avatar: member.user.displayAvatarURL({ size: 128 }),
            }));
            // check for ID query
            if (req.query.ID)
                members = members.filter(mem => mem.id == req.query.ID);
            // check if any member are left
            if (!members[0]) {
                res.status(400).json({ error: 'No members found!' });
            }
            else {
                return res.status(200).json({ members });
            }
        }
        res.status(400).json({ error: 'Guild not found!' });
    }));
    // get list of channels (plus ability for TYPE & PERMS filtering)
    router.get('/:guildId/channels', (req, res) => __awaiter(this, void 0, void 0, function* () {
        // fetch member list of guild
        const guild = bot.guilds.cache.get(req.params.guildId);
        if (guild) {
            let channels = guild.channels.cache.map(channel => ({
                type: channel.type,
                id: channel.id,
                name: channel.name,
                parentID: channel.parentId || null,
            }));
            // check for type query
            if (req.query.type)
                channels = channels.filter(c => c.type == req.query.type);
            // check for permission query
            if (req.query.perms) {
                channels = channels.filter(channel => {
                    const ch = guild.channels.cache.get(channel.id);
                    return ch.permissionsFor(bot.user).has(BigInt(parseInt(req.query.perms))) ? true : false;
                });
            }
            // check if any member are left
            if (!channels[0]) {
                res.status(400).json({ error: 'No channels found!' });
            }
            else {
                res.status(200).json({ channels });
            }
        }
        else {
            res.status(400).json({ error: 'Guild not found!' });
        }
    }));
    return router;
};
