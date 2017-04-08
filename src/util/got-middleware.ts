import * as express from "express";
import { Auth } from "./auth";
export class GotMiddleware {
    static readonly authenticated: express.RequestHandler = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        if (req.header.hasOwnProperty("Authorization")) {
            let split: string[] = req.header["Authorization"].split(" ");
            if (split.length === 2 && split[0].toLowerCase() === "bearer") {
                Auth.verify(split[1])
                    .then(data => {
                        req.user = data.user;
                        next();
                    })
                    .catch(err => {
                        next(err);
                    });
                return;
            }
        }
        next(new Error("no auth header"));
    };

}