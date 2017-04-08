import * as express from "express";
import {
    RedditHelper,
    Scope,
    Auth
} from "./../../../util/";
import {
    Config
} from "./../../../config";

export class ConfigEndpoints {

    static readonly getConfig: express.RequestHandler = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        let val: any = {
            "redirect_uri": Config.redditRedirectUri
        }
        res.json(val);
    }
}