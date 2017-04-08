import * as redis from "redis";

enum TokenType {
    ACCESS = 1,
    REFRESH = 2
}

export type SetData = {
    key: string;
    value: string;
    ttl?: number;
}

export class RedisApi {
    private static _redis: redis.RedisClient;
    private static redis(): Promise<redis.RedisClient> {
        return new Promise<redis.RedisClient>((resolve, reject) => {
            if (this._redis == null) {
                this._redis = redis.createClient();
                let errorCallback = (err) => {
                    reject(err);
                };
                this._redis.on("ready", () => {
                    this._redis.removeListener("error", errorCallback);
                    resolve(this._redis);
                }).on("error", errorCallback);
            }
            resolve(this._redis);
        });
    }

    private static createRedditTokenKey(user: string, type: TokenType): string {
        return "token:" + user + ":reddit:" + (type == TokenType.ACCESS) ? "accesss" : "refresh";
    }

    private static createGotTokenKey(user: string, token: string, type: TokenType): string {
        return "token:" + user + ":got:" + (type == TokenType.ACCESS) ? "accesss:" : "refresh:" + token;
    }

    private static setMulti(data: SetData[]): Promise<boolean> {
        return this.redis()
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

    public static storeGotToken(user: string, acccess_token: string, refresh_token: string): Promise<boolean> {
        return this.setMulti([{
            key: this.createRedditTokenKey(user, TokenType.ACCESS),
            value: acccess_token,
            ttl: 3600
        }, {
            key: this.createRedditTokenKey(user, TokenType.REFRESH),
            value: refresh_token,
            ttl: 3600 * 24
        }]);
    }

    public static storeRedditToken(user: string, acccess_token: string, refresh_token: string): Promise<boolean> {
        return this.setMulti([{
            key: this.createRedditTokenKey(user, TokenType.ACCESS),
            value: user,
            ttl: 3600
        }, {
            key: this.createRedditTokenKey(user, TokenType.REFRESH),
            value: user,
            ttl: 3600 * 24
        }]);
    }

}