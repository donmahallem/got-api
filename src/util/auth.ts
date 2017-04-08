import * as jwt from "jsonwebtoken";
import { Config } from "./../config";
import * as crypto from "crypto";
import * as redis from "redis";
import { RedisApi } from "./redis.api";

export enum Audience {
    USER = 1,
    ADMIN = 2
}

export type JwtBody = {
    reddit: {
        name: string;
        id: string;
    }
}

export class Auth {
    private static readonly gotAccessTokenPrefix: string = "got:token:access:";
    private static readonly gotRefreshTokenPrefix: string = "got:token:refresh:";

    public static randomBytes(length: number): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(length, (err: Error, buf: Buffer) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(buf);
                }
            });
        })
    }

    public static createAccessToken(user: { id: string, name: string }): Promise<string> {
        return this.randomBytes(64)
            .then(key => {
                return this.signAccessToken({
                    user: user,
                    token: key.toString("hex")
                });
            });
    }

    public static createRefreshToken(user: { id: string, name: string }): Promise<string> {
        return this.randomBytes(64)
            .then(key => {
                return this.signRefreshToken({
                    user: user,
                    token: key.toString("hex")
                });
            })
            .then(token => {
                return RedisApi.storeGotToken(user.id, token)
                    .then(result => {
                        return token;
                    })
            });
    }

    public static signAccessToken(data: string | JwtBody | any, expires: number | string = "1h"): Promise<string> {
        return Auth.sign(data, "acccess_token", expires);
    }

    public static signRefreshToken(data: string | JwtBody | any, expires: number | string = "7d"): Promise<string> {
        return Auth.sign(data, "refresh_token", expires);
    }

    public static sign(data: string | JwtBody | any, subject: string, expires: number | string = "1h"): Promise<string> {
        return new Promise((resolve, reject) => {
            let options: jwt.SignOptions = {
                algorithm: "HS512",
                audience: ["user"],
                expiresIn: expires,
                subject: subject,
                issuer: Config.jwtIssuer
            };
            jwt.sign(data, Config.jwtSecret, options, (err, token) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(token);
                }
            });
        });
    }

    public static verify(token: string): Promise<JwtBody | string> {
        return new Promise((resolve, reject) => {
            let options: jwt.VerifyOptions = {
                algorithms: ["HS512"],
                issuer: Config.jwtIssuer,
                clockTolerance: 60
            }
            jwt.verify(token, Config.jwtSecret, options, (error, decoded) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(decoded);
                }
            })
        });
    }

    public static tt(): boolean {
        return true;
    }
}