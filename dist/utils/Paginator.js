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
// variables
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, CommandInteraction, ComponentType } = require('discord.js');
module.exports = (bot, type, pages, userID) => __awaiter(void 0, void 0, void 0, function* () {
    let page = 0;
    const row = new ActionRowBuilder()
        .addComponents(new ButtonBuilder()
        .setCustomId('1')
        .setLabel('⏮')
        .setStyle(ButtonStyle.Secondary), new ButtonBuilder()
        .setCustomId('2')
        .setLabel('◀️')
        .setStyle(ButtonStyle.Secondary), new ButtonBuilder()
        .setCustomId('3')
        .setLabel('▶️')
        .setStyle(ButtonStyle.Secondary), new ButtonBuilder()
        .setCustomId('4')
        .setLabel('⏭')
        .setStyle(ButtonStyle.Secondary));
    let curPage;
    if (type instanceof CommandInteraction) {
        curPage = yield type.reply({ embeds: [pages[page]], components: [row], fetchReply: true });
    }
    else {
        curPage = yield type.send({ embeds: [pages[page]], components: [row] });
    }
    const buttonCollector = yield curPage.createMessageComponentCollector({ componentType: ComponentType.Button });
    // find out what emoji was reacted on to update pages
    buttonCollector.on('collect', (i) => {
        if (i.user.id !== userID)
            return;
        switch (Number(i.customId)) {
            case 1:
                page = 0;
                break;
            case 2:
                page = page > 0 ? --page : 0;
                break;
            case 3:
                page = page + 1 < pages.length ? ++page : (pages.length - 1);
                break;
            case 4:
                page = pages.length - 1;
                break;
            default:
                break;
        }
        i.update({ embeds: [pages[page]] });
    });
    // when timer runs out remove all reactions to show end of pageinator
    buttonCollector.on('end', () => curPage.edit({ embeds: [pages[page]], components: [] }));
    return curPage;
});
