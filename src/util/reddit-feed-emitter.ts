/*!
 * Source https://github.com/donmahallem/got-api
 */

import { EventEmitter } from "events";
import { RedisClient } from "redis";

export class RedditFeedEmitter extends EventEmitter {
    private sub: RedisClient;
    constructor(sub: RedisClient) {
        super();
        this.sub = sub;
    }

    public quit() {
        this.sub.quit();
    }
}