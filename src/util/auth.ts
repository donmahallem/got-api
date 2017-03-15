import * as jwt from "jsonwebtoken";
import { Config } from "./../config";

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
    public static sign(data: string | object | JwtBody): Promise<string> {
        return new Promise((resolve, reject) => {
            let options: jwt.SignOptions = {
                algorithm: "HS512",
                audience: ["user"],
                expiresIn: "1h",
                subject: "access",
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

    public static verify(token: string): Promise<object | string> {
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