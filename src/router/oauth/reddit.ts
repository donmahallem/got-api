/*!
 * Source https://github.com/donmahallem/got-api
 */

import express from "express";
import { Config } from "./../../config";
import {
    Auth,
} from "./../../util/auth";
import {
    RedditHelper,
    Scope,
} from "./../../util/reddit-helper";

const router: express.Router = express.Router();
router.get("/oauth/reddit", (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.redirect(RedditHelper.createAuthorizeUrl([Scope.IDENTITY], "random"));
});
router.get("/oauth/reddit/authorize", (req: express.Request, res: express.Response, next: express.NextFunction) => {
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
                });
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
});
router.get("/oauth/token", (req: express.Request, res: express.Response, next: express.NextFunction) => {
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
});
export = router;
