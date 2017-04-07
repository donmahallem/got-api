import * as express from "express";

export class UserEndpoints {
    static readonly getMe: express.RequestHandler = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        res.json(req);
    };
    static readonly getUser: express.RequestHandler = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        res.json(req);
    };

}