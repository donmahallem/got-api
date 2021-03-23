/*!
 * Source https://github.com/donmahallem/got-api
 */

import express from "express";
import {
    Config,
} from "./../../../config";
import {
    Auth,
    RedditHelper,
    RedisApi,
    Scope,
} from "./../../../util/";

export class RedditEndpoints {
    static readonly signin: express.RequestHandler = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        res.redirect(RedditHelper.createAuthorizeUrl([Scope.IDENTITY], "random"));
    };
    static readonly authorize: express.RequestHandler = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        if (typeof req.query.code === "undefined") {
            next(new Error("No code argument provided"));
        } else {
            RedditHelper.exchangeCode(req.query.code as string)
                .then((data) =>
                    RedditHelper.getMe(data.access_token))
                .then((user) => {
                    const accessTokenPromise: Promise<string> = Auth.signAccessToken({
                        user: {
                            id: user.id,
                            name: user.name,
                        },
                    }).then(value =>
                        value);
                    const refreshTokenPromise: Promise<string> = Auth.randomBytes(128)
                        .then((token) =>
                            Auth.signRefreshToken({
                                token: token.toString("hex"),
                                user: user.id,
                            }));
                    return Promise.all([accessTokenPromise, refreshTokenPromise]);
                })
                .then((jwts) => {
                    const authCookieOptions: express.CookieOptions = {
                        expires: new Date(Date.now() + (1000 * 3600 * 24)),
                        httpOnly: true,
                        secure: Config.cookiesSecure,
                    };
                    res.cookie("X-AUTH-TOKEN", jwts[0], authCookieOptions);
                    const refreshCookieOptions: express.CookieOptions = {
                        expires: new Date(Date.now() + (1000 * 3600 * 24 * 7)),
                        httpOnly: true,
                        secure: Config.cookiesSecure,
                    };
                    res.cookie("X-REFRESH-TOKEN", jwts[1], refreshCookieOptions);
                    res.redirect("/");
                })
                .catch((error) => {
                    next(error);
                });
        }
    }

    public static getLive: express.RequestHandler = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        // req.socket.setTimeout(Infinity);
        req.connection.setTimeout(1000000);
        res.writeHead(200, {
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Content-Type': 'text/event-stream',
            'Transfer-Encoding': 'chunked',
            'X-Content-Type-Options': 'nosniff',
        });
        const emitter = RedisApi.redditFeed();
        emitter.on("message", submission => {
            res.write("event: submission\n");
            res.write("id: " + parseInt(submission.id, 36) + "\n");
            res.write("data: ");
            res.write(JSON.stringify(submission));
            res.write("\n\n");
        });
        emitter.once("error", error => {
            res.write("event: error\nmessage: error message\n\n")
            res.end();
        });
        emitter.once("end", () => {
            res.end();
        });
    };
    static readonly token: express.RequestHandler = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        if (req.query.hasOwnProperty("action")) {
            if (req.query.action === "refresh_token") {
                res.send("refresh");
                res.end();
            } else if (req.query.action === "info") {
                res.send("info");
                res.end();
            } else {
                next(new Error());
            }
        } else {
            next(new Error());
        }
    }
}
