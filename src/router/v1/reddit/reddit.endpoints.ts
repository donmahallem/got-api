import * as express from "express";
import {
    RedditHelper,
    Scope,
    Auth,
    RedisApi
} from "./../../../util/";
import {
    Config
} from "./../../../config";

export class RedditEndpoints {
    static readonly signin: express.RequestHandler = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        res.redirect(RedditHelper.createAuthorizeUrl([Scope.IDENTITY], "random"));
    };
    static readonly authorize: express.RequestHandler = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        if (typeof req.query.code === "undefined") {
            next(new Error("No code argument provided"));
        } else {
            RedditHelper.exchangeCode(req.query.code)
                .then((data) => {
                    return RedditHelper.getMe(data["access_token"])
                })
                .then((user) => {
                    let accessTokenPromise: Promise<string> = Auth.signAccessToken({
                        user: {
                            id: user.id,
                            name: user.name
                        }
                    }).then(value => {
                        return value;
                    });
                    let refreshTokenPromise: Promise<string> = Auth.randomBytes(128)
                        .then((token) => {
                            return Auth.signRefreshToken({
                                user: user.id,
                                token: token.toString("hex")
                            });
                        });
                    return Promise.all([accessTokenPromise, refreshTokenPromise]);
                })
                .then((jwts) => {
                    let authCookieOptions: express.CookieOptions = {
                        httpOnly: true,
                        secure: Config.cookiesSecure,
                        expires: new Date(Date.now() + (1000 * 3600 * 24))
                    };
                    res.cookie("X-AUTH-TOKEN", jwts[0], authCookieOptions);
                    let refreshCookieOptions: express.CookieOptions = {
                        httpOnly: true,
                        secure: Config.cookiesSecure,
                        expires: new Date(Date.now() + (1000 * 3600 * 24 * 7))
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
        //req.socket.setTimeout(Infinity);
        req.connection.setTimeout(1000000);
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        });
        res.write('\n');
        let aborted: boolean = false;
        let sub = RedisApi.redditFeed();
        const finish: Function = (error?: Error) => {
            console.log("end", "recieved");
            sub.quit();
            res.end()
        };
        req.on("close", finish);
        req.on("error", finish);
        sub.on("message", submission => {
            console.log("Sub recieved", JSON.stringify(submission))
            res.write("event: submission\n");
            res.write("id: " + parseInt(submission.id, 36) + "\n");
            res.write("data: ");
            res.write(JSON.stringify(submission));
            res.write("\n\n");
        });
        sub.on("error", err => {
            res.end();
        });
        sub.on("end", () => {
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