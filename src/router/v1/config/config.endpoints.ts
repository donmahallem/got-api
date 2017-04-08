import * as express from "express";
import {
    RedditHelper,
    Scope,
    Auth,
    Duration
} from "./../../../util/";
import {
    Config
} from "./../../../config";

export class ConfigEndpoints {

    static readonly getConfig: express.RequestHandler = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        let val: any = {
            "redirect_uri": RedditHelper.createAuthorizeUrl([Scope.VOTE, Scope.IDENTITY], "random_state", Duration.PERMANENT)
        }
        res.json(val);
    }
}