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
            if (req.body.action === "refresh_token" && req.body.hasOwnProperty("refresh_token")) {
                res.send("refresh");
                res.end();
            } else if (req.body.action === "code" && req.body.hasOwnProperty("code")) {
                res.send(req.body.code);
                res.end();
            } else {
                next(new Error("no stuff provided"));
            }
        } else {
            next(new Error("no type provided"));
        }
    }
}