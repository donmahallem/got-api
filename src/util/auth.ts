/*!
 * Source https://github.com/donmahallem/got-api
 */
import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";
import * as passportjs from "passport";
import * as passportjsBearer from "passport-http-bearer";
import { Config } from "./../config";
import { RedisApi } from "./redis.api";

passportjs.use(new passportjsBearer.Strategy((token, done) => {
    // tslint:disable-next-line:no-console
    console.log("Called");
}));
export enum Audience {
    USER = 1,
    ADMIN = 2,
}

export type JwtBody = {
    reddit: {
        id: string;
        name: string;
    },
}

export class Auth {

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
        return Auth.randomBytes(64)
            .then(key => Auth.signAccessToken({
                token: key.toString("hex"),
                user,
            }));
    }

    public static createRefreshToken(user: { id: string, name: string }): Promise<string> {
        return Auth.randomBytes(64)
            .then(buf => {
                const hexed = buf.toString("hex");
                return RedisApi.storeRefreshToken(user.id, hexed).then(succes => hexed);
            })
            .then(key => Auth.signRefreshToken({
                token: key,
                user,
            }));
    }

    public static signAccessToken(data: string | JwtBody | any, expires: number | string = "5m"): Promise<string> {
        return Auth.sign(data, "acccess_token", expires);
    }

    public static signRefreshToken(data: string | JwtBody | any, expires: number | string = "7d"): Promise<string> {
        return Auth.sign(data, "refresh_token", expires);
    }

    public static sign(data: string | JwtBody | any, subject: string, expires: number | string = "1h"): Promise<string> {
        return new Promise((resolve, reject) => {
            const options: jwt.SignOptions = {
                algorithm: "HS512",
                audience: ["user"],
                expiresIn: expires,
                issuer: Config.jwtIssuer,
                subject,
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

    public static verify(token: string): Promise<JwtBody | string | any> {
        return new Promise((resolve, reject) => {
            const options: jwt.VerifyOptions = {
                algorithms: ["HS512"],
                clockTolerance: 60,
                issuer: Config.jwtIssuer,
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