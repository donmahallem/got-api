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
        if (req.query.hasOwnProperty("type")) {
            if (req.query.action === "refresh_token" && req.query.hasOwnProperty("refresh_token")) {
                res.send("refresh");
                res.end();
            } else if (req.query.action === "code" && req.query.hasOwnProperty("code")) {
                res.send(req.query);
                res.end();
            } else {
                next(new Error());
            }
        } else {
            next(new Error());
        }
    }
}