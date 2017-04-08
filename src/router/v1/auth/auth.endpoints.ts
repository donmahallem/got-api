import * as express from "express";
import {
    RedditHelper,
    Scope,
    Auth
} from "./../../../util/";
import {
    Config
} from "./../../../config";

export class AuthEndpoints {

    static readonly token: express.RequestHandler = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        if (req.body.hasOwnProperty("type")) {
            if (req.body.type === "refresh_token" && req.body.hasOwnProperty("refresh_token")) {
                let response = {};
                res.json(response);
            } else if (req.body.type === "code" && req.body.hasOwnProperty("code")) {
                RedditHelper.exchangeCode(req.body.code)
                    .then((resp) => {
                        return RedditHelper.getMe(resp.access_token)
                            .then(me => {
                                return {
                                    name: me.name,
                                    access_token: resp.access_token,
                                    refresh_token: resp.refresh_token
                                }
                            });
                    })
                    .then(data => {
                        return Auth.storeRedditToken(data.name, data.access_token, data.refresh_token)
                            .then(success => {
                                return data;
                            });
                    })
                    .then(data => {

                        let accessTokenBody = {};
                        let refreshTokenBody = {};
                        return Promise.all([Auth.signAccessToken(accessTokenBody), Auth.signRefreshToken(refreshTokenBody)]);
                    })
                    .then(tokens => {
                        res.json({
                            "data": {
                                "access_token": tokens[0],
                                "refresh_token": tokens[1]
                            }
                        });
                    }).catch(err => {
                        next(err);
                    });
            } else {
                next(new Error("no stuff provided"));
            }
        } else {
            next(new Error("no type provided"));
        }
    }
}