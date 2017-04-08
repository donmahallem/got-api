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
                                    id: me.id,
                                    access_token: resp.access_token,
                                    refresh_token: resp.refresh_token
                                }
                            });
                    })
                    .then(data => {
                        return RedisApi.storeRedditToken(data.id, data.access_token, data.refresh_token)
                            .then(success => {
                                console.log(success);
                                return data;
                            });
                    })
                    .then(data => {
                        let user = {
                            id: data.id,
                            name: data.name
                        }
                        return Promise.all([Auth.createAccessToken(user), Auth.createRefreshToken(user)])
                            .then(results => {
                                return {
                                    id: data.id,
                                    name: data.name,
                                    access_token: results[0],
                                    refresh_token: results[1]
                                }
                            });
                    })
                    .then(data => {
                        return RedisApi.storeGotToken(data.id, data.access_token, data.refresh_token)
                            .then(success => {
                                res.json({
                                    "data": data
                                });
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