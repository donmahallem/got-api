/*!
 * Source https://github.com/donmahallem/got-api
 */

import * as express from "express";
import {
    Auth,
    RedditHelper,
    RedisApi,
} from "./../../../util/";
export class AuthEndpoints {

    static readonly token: express.RequestHandler = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        if (req.body.hasOwnProperty("type")) {
            if (req.body.type === "refresh_token" && req.body.hasOwnProperty("refresh_token")) {
                Auth.verify(req.body.refresh_token)
                    .then(decoded =>
                        Promise.all([Auth.createAccessToken(decoded.user.id), Auth.createRefreshToken(decoded.user.id)]))
                    .then(tokens => {
                        res.json({
                            data: {
                                access_token: tokens[0],
                                refresh_token: tokens[1],
                            },
                        });
                    })
                    .catch(err => {
                        next(err);
                    });
            } else if (req.body.type === "code" && req.body.hasOwnProperty("code")) {
                RedditHelper.exchangeCode(req.body.code)
                    .then((resp) =>
                        RedditHelper.getMe(resp.access_token)
                            .then(me =>
                                ({
                                    access_token: resp.access_token,
                                    id: me.id,
                                    name: me.name,
                                    refresh_token: resp.refresh_token,
                                })))
                    .then(data =>
                        RedisApi.storeRedditToken(data.id, data.access_token, data.refresh_token)
                            .then(success => data))
                    .then(data => {
                        const user = {
                            id: data.id,
                            name: data.name,
                        };
                        return Promise.all([Auth.createAccessToken(user), Auth.createRefreshToken(user)])
                            .then(results =>
                                ({
                                    access_token: results[0],
                                    id: data.id,
                                    name: data.name,
                                    refresh_token: results[1],
                                }));
                    })
                    .then(data => {
                        res.json({
                            "data": data,
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