/*!
 * Source https://github.com/donmahallem/got-api
 */

import * as express from "express";
import {
    Duration,
    RedditHelper,
    Scope,
} from "./../../../util/";

export class ConfigEndpoints {

    static readonly getConfig: express.RequestHandler = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const val: any = {
            "redirect_uri": RedditHelper.createAuthorizeUrl([Scope.VOTE, Scope.IDENTITY], "random_state", Duration.PERMANENT),
        }
        res.json(val);
    }
}