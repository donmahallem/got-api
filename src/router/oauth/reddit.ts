/*!
 * Source https://github.com/donmahallem/got-api
 */

import * as express from "express";
import { Config } from "./../../config";
import {
    Auth,
} from "./../../util/auth";
import {
    RedditHelper,
    Scope,
} from "./../../util/reddit-helper";

let router: express.Router = express.Router();
router.get("/oauth/reddit", (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.redirect(RedditHelper.createAuthorizeUrl([Scope.IDENTITY], "random"));
});
router.get("/oauth/reddit/authorize", (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (typeof req.query.code === "undefined") {
        next(new Error("No code argument provided"));
    } else {
        RedditHelper.exchangeCode(req.query.code)
            .then((data) => {
                return RedditHelper.getMe(data.access_token)
            })
            .then((user) => {
                let accessTokenPromise: Promise<string> = Auth.signAccessToken({
                    user: {
                        id: user.id,
                        name: user.name
  ,                  }
  ,              });
                let refreshTokenPromise: Promise<string> = Auth.randomBytes(128)
                    .then((token) => {
                        return Auth.signRefreshToken({
                            user: user.id,
                            token: token.toString("hex")
    ,                    });
                    });
                return Promise.all([accessTokenPromise, refreshTokenPromise]);
            })
            .then((jwts) => {
                let authCookieOptions: express.CookieOptions = {
                    httpOnly: true,
                    secure: Config.cookiesSecure,
                    expires: new Date(Date.now() + (1000 * 3600 * 24))
      ,          };
                res.cookie("X-AUTH-TOKEN", jwts[0], authCookieOptions);
                let refreshCookieOptions: express.CookieOptions = {
                    httpOnly: true,
                    secure: Config.cookiesSecure,
                    expires: new Date(Date.now() + (1000 * 3600 * 24 * 7))
        ,        };
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
