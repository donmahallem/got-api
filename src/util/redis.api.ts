import * as redis from "redis";

export class RedisApi {
    private static readonly REDDIT_TOKEN_ACCESS = "reddit:token:access:";
    private static readonly REDDIT_TOKEN_REFRESH = "reddit:token:refresh:";
    private static _redis: redis.Client;
    private static redis(): Promise<redis.Client> {
        return new Promise<redis.Client>((resolve, reject) => {
            if (this._redis == null) {
                this._redis = redis.createClient();
                let errorL = this._redis.on("error", err => {
                    reject(new Error("Couldnt connect to redis"));
                });
                this._redis.on("ready", () => {
                    this._redis.removeListener(errorL);
                    resolve(this._redis);
                })
            }
            resolve(this._redis);
        });
    }

    public static storeRedditToken(user: string, acccess_token: string, refresh_token: string): Promise<boolean> {
        return this.redis()
            .then(redisClient => {
                let accessTokenKey = RedisApi.REDDIT_TOKEN_ACCESS + user;
                let refreshTokenKey = RedisApi.REDDIT_TOKEN_REFRESH + user;
                return new Promise((resolve, reject) => {
                    redisClient.multi()
                        .set(accessTokenKey, acccess_token, 'EX', 3600)
                        .set(refreshTokenKey, refresh_token, 'EX', 3600 * 24)
                        .exec((err, cb) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(cb);
                            }
                        });
                })
            });
    }
}