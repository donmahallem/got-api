/*!
 * Source https://github.com/donmahallem/got-api
 */

import * as redis from "redis";
import * as EventEmitter from "events";
import {
    Transform,
    PassThrough,
} from "stream";
enum TokenType {
    ACCESS = 1,
    REFRESH = 2,
}

export type SetData = {
    key: string;
    value: string;
    ttl?: number;
}

export class RedditFeedEmitter extends EventEmitter {
    private sub: redis.RedisClient;
    constructor(sub: redis.RedisClient) {
        super();
        this.sub = sub;
    }

    public quit() {
        this.sub.quit();
    }
}

export class RedditFeedStream extends Transform {
}

export class RedisApi {
    private static REDIS_INSTANCE: redis.RedisClient;
    private static redis(): Promise<redis.RedisClient> {
        return new Promise<redis.RedisClient>((resolve, reject) => {
            if (RedisApi.REDIS_INSTANCE == null) {
                RedisApi.REDIS_INSTANCE = redis.createClient();
                let errorCallback = (err) => {
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
        return "token:" + user + ":reddit:" + (type == TokenType.ACCESS) ? "accesss" : "refresh";
    }

    private static createGotTokenKey(token: string, type: TokenType): string {
        return "token:got:" + (type == TokenType.ACCESS) ? "accesss:" : "refresh:" + token;
    }

    private static setMulti(data: SetData[]): Promise<boolean> {
        return RedisApi.redis()
            .then(redisClient => {
                return new Promise<boolean>((resolve, reject) => {
                    let multi = redisClient.multi();
                    for (let d of data) {
                        if (d.ttl > 0) {
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
                });
            });
    }

    private static set(key: string, value: string, duration: number = -1): Promise<string> {
        return RedisApi.redis().then(redisClient => {
            return new Promise<string>((resolve, reject) => {
                if (duration > 0) {
                    redisClient.set(key, value, "EX", duration, (err, cb) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(cb);
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
            });
        });
    }

    public static redditFeed(): RedditFeedEmitter {
        let sub = redis.createClient();
        let emitter: RedditFeedEmitter = new RedditFeedEmitter(sub);
        sub.on("message", function (channel, message) {
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
        let sub = redis.createClient();
        let emitter: PassThrough = new PassThrough({
            readableObjectMode: true,
            writableObjectMode: true,
            objectMode: true
        });
        sub.on("message", function (channel, message) {
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

    public static storeRefreshToken(id: string, refresh_token: string): Promise<string> {
        return RedisApi.set(RedisApi.createGotTokenKey(refresh_token, TokenType.REFRESH), id, 3600 * 24);
    }

    public static storeGotToken(user: string, acccess_token: string, refresh_token: string): Promise<boolean> {
        return this.setMulti([{
            key: this.createRedditTokenKey(user, TokenType.ACCESS),
            ttl: 3600,
            value: acccess_token,
        }, {
            key: this.createRedditTokenKey(user, TokenType.REFRESH),
            ttl: 3600 * 24,
            value: refresh_token,
        }]);
    }

    public static storeRedditToken(user: string, acccess_token: string, refresh_token: string): Promise<boolean> {
        return this.setMulti([{
            key: this.createRedditTokenKey(user, TokenType.ACCESS),
            ttl: 3600,
            value: user,
        }, {
            key: this.createRedditTokenKey(user, TokenType.REFRESH),
            ttl: 3600 * 24,
            value: user,
        }]);
    }

}