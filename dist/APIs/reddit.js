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
const { Collection } = require('discord.js'), fetch = require('node-fetch');
/**
 * Reddit API
*/
class RedditAPI {
    constructor() {
        /**
         * An array of 'meme' subreddits
         * @type {array}
        */
        this.memeSubreddits = ['funny', 'jokes', 'comedy', 'notfunny', 'bonehurtingjuice',
            'ComedyCemetery', 'comedyheaven', 'dankmemes', 'meme'];
        /**
         * ALlows for subreddit caching (No reddit API abuse)
         * @type {Collection}
        */
        this.cachedSubreddits = new Collection();
    }
    /**
     * Function for fetching a meme post from reddit
     * @param {object} options The options for post filtering
     * @returns {RedditPost}
    */
    fetchMeme(options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            // choose a subreddit to get meme from
            const subreddit = this.memeSubreddits[Math.floor(Math.random() * this.memeSubreddits.length)];
            // check cache system before requesting reddit
            if (this.cachedSubreddits.has(subreddit)) {
                return this._fetchPost(this.cachedSubreddits.get(subreddit), options);
            }
            else {
                const resp = yield fetch(`https://www.reddit.com/r/${subreddit}/hot.json`).then(res => res.json());
                this._handleCache(subreddit, resp);
                return this._fetchPost(resp, options);
            }
        });
    }
    /**
     * Function for fetching subreddit post from reddit
     * @param {string} subreddit The subreddit to search for
     * @param {object} options The options for post filtering
     * @returns {RedditPost}
    */
    fetchSubreddit(subreddit, options = {}) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            // check cache system before requesting reddit
            if (this.cachedSubreddits.has(`${subreddit}_${options.type}`)) {
                return this._fetchPost(this.cachedSubreddits.get(`${subreddit}_${options.type}`), options);
            }
            else {
                const resp = yield fetch(`https://www.reddit.com/r/${subreddit}/${(_a = options.type) !== null && _a !== void 0 ? _a : 'hot'}.json`).then(res => res.json());
                if (resp.error)
                    throw new Error(`Error: '${resp.message}' when searching for that subreddit.`);
                this._handleCache(`${subreddit}_${(_b = options.type) !== null && _b !== void 0 ? _b : 'hot'}`, resp);
                return this._fetchPost(resp, options);
            }
        });
    }
    /**
     * Function for turning raw reddit data to RedditPost for bot
     * @param {object} data The raw JSON data from reddit API
     * @param {object} options The options for post filtering
     * @returns {RedditPost}
     * @private
    */
    _fetchPost({ data }, options) {
        // Check if NSFW posts needs to be filtered out
        if (options.removeNSFW)
            data.children = data.children.filter(post => !post.data.over_18);
        // Double check there are still posts after filtering (if any)
        if (!data.children[0])
            throw new Error('No posts were found with that filter.');
        // Choose post and send back to bot
        const post = data.children[Math.floor(Math.random() * 25)].data;
        return new RedditPost(post);
    }
    /**
     * Function for removing subreddit from cache after 5 minutes.
     * @param {string} subreddit The subreddit
     * @param {Object} resp The raw JSON data from reddit API
     * @returns {void}
     * @private
    */
    _handleCache(subreddit, resp) {
        this.cachedSubreddits.set(subreddit, resp);
        setTimeout(() => {
            this.cachedSubreddits.delete(subreddit);
        }, 5 * 60 * 1000);
    }
}
/**
 * Reddit post
*/
class RedditPost {
    constructor({ title, subreddit, permalink, url, ups, downs, author, num_comments, over_18, media }) {
        /**
         * The title of the subreddit
         * @type {string}
        */
        this.title = title;
        /**
         * The subreddit the post is from
         * @type {string}
        */
        this.subreddit = subreddit;
        /**
         * The link to the post
         * @type {string}
        */
        this.link = `https://www.reddit.com${permalink}`;
        /**
         * The image from the post
         * @type {string}
        */
        this.imageURL = media ? media.oembed.thumbnail_url : url;
        /**
         * The upvotes of the post
         * @type {number}
        */
        this.upvotes = ups !== null && ups !== void 0 ? ups : 0;
        /**
         * The downvotes of the post
         * @type {number}
        */
        this.downvotes = downs !== null && downs !== void 0 ? downs : 0;
        /**
         * The user who posted the post
         * @type {string}
        */
        this.author = author;
        /**
         * The number of comments
         * @type {number}
        */
        this.comments = num_comments !== null && num_comments !== void 0 ? num_comments : 0;
        /**
         * Whether of not it's NSFW or not
         * @type {boolean}
        */
        this.nsfw = over_18;
    }
}
module.exports = RedditAPI;
