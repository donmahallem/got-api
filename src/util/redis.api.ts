/*!
 * Source https://github.com/donmahallem/got-api
 */

import * as redis from "redis";
import {
    PassThrough,
} from "stream";
import { RedditFeedEmitter } from "./reddit-feed-emitter";
enum TokenType {
    ACCESS = 1,
    REFRESH = 2,
}

export type SetData = {
    key: string;
    value: string;
    ttl?: number;
}

export class RedisApi {
    private static REDIS_INSTANCE: redis.RedisClient;

    public static redditFeed(): RedditFeedEmitter {
        const sub = redis.createClient();
        const emitter: RedditFeedEmitter = new RedditFeedEmitter(sub);
        sub.on("message", (channel, message) => {
            emitter.emit("message", JSON.parse(message));
        });
        sub.on("error", err => {
            emitter.emit("error", err);
        });
        sub.on("end", () => {
            emitter.emit("end");
        });
        sub.subscribe("reddit:submission");
        return emitter;
    }

    public static redditFeedStream(): PassThrough {
        const sub = redis.createClient();
        const emitter: PassThrough = new PassThrough({
            objectMode: true,
            readableObjectMode: true,
            writableObjectMode: true,
        });
        sub.on("message", (channel, message) => {
            emitter.push(JSON.parse(message));
        });
        sub.on("error", err => {
            emitter.end();
        });
        sub.on("end", () => {
            emitter.end();
        });
        sub.subscribe("reddit:submission");
        return emitter;
    }

    public static storeRefreshToken(id: string, refreshToken: string): Promise<string> {
        return RedisApi.set(RedisApi.createGotTokenKey(refreshToken, TokenType.REFRESH), id, 3600 * 24);
    }

    public static storeGotToken(user: string, acccessToken: string, refreshToken: string): Promise<boolean> {
        return RedisApi.setMulti([{
            key: RedisApi.createRedditTokenKey(user, TokenType.ACCESS),
            ttl: 3600,
            value: acccessToken,
        }, {
            key: RedisApi.createRedditTokenKey(user, TokenType.REFRESH),
            ttl: 3600 * 24,
            value: refreshToken,
        }]);
    }

    public static storeRedditToken(user: string, acccessToken: string, refreshToken: string): Promise<boolean> {
        return RedisApi.setMulti([{
            key: RedisApi.createRedditTokenKey(user, TokenType.ACCESS),
            ttl: 3600,
            value: user,
        }, {
            key: RedisApi.createRedditTokenKey(user, TokenType.REFRESH),
            ttl: 3600 * 24,
            value: user,
        }]);
    }
    private static redis(): Promise<redis.RedisClient> {
        return new Promise<redis.RedisClient>((resolve, reject) => {
            if (RedisApi.REDIS_INSTANCE === undefined) {
                RedisApi.REDIS_INSTANCE = redis.createClient();
                const errorCallback = (err) => {
                    reject(err);
                };
                RedisApi.REDIS_INSTANCE.on("ready", () => {
                    RedisApi.REDIS_INSTANCE.removeListener("error", errorCallback);
                    resolve(RedisApi.REDIS_INSTANCE);
                }).on("error", errorCallback);
            }
            resolve(RedisApi.REDIS_INSTANCE);
        });
    }

    private static createRedditTokenKey(user: string, type: TokenType): string {
        return "token:" + user + ":reddit:" + (type === TokenType.ACCESS) ? "accesss" : "refresh";
    }

    private static createGotTokenKey(token: string, type: TokenType): string {
        return "token:got:" + (type === TokenType.ACCESS) ? "accesss:" : "refresh:" + token;
    }

    private static setMulti(data: SetData[]): Promise<boolean> {
        return RedisApi.redis()
            .then(redisClient => new Promise<boolean>((resolve, reject) => {
                const multi = redisClient.multi();
                for (const d of data) {
                    if (d.ttl && d.ttl > 0) {
                        multi.set(d.key, d.value, "EX", d.ttl);
                    } else {
                        multi.set(d.key, d.value);
                    }
                }
                multi.exec((err, cb) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(true);
                    }
                })
            }));
    }

    private static set(key: string, value: string, duration: number = -1): Promise<string> {
        return RedisApi.redis().then(redisClient =>
            new Promise<string>((resolve, reject) => {
                if (duration > 0) {
                    redisClient.set(key, value, "EX", duration, (err, cb) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(cb || 'OK');
                        }
                    });
                } else {
                    redisClient.set(key, value, (err, cb) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(cb);
                        }
                    });
                }
            }));
    }

}
