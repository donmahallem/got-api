/*!
 * Source https://github.com/donmahallem/got-api
 */

import * as express from "express";
import { Auth } from "./auth";
export class GotMiddleware {
    static readonly authenticated: express.RequestHandler = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        if (req.get("Authorization")) {
            const split: string[] = req.get("Authorization").split(" ");
            if (split.length === 2 && split[0].toLowerCase() === "bearer") {
                Auth.verify(split[1])
                    .then(data => {
                        req.user = data.user;
                        next();
                    })
                    .catch(err => {
                        res.sendStatus(401);
                    });
                return;
            }
        }
        next(new Error("no auth header"));
    };

}