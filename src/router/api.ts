/*!
 * Source https://github.com/donmahallem/got-api
 */

import express from "express";
import { apiRouter as v1Router } from "./v1/v1.router";

export const apiRouter: express.Router = express.Router();
apiRouter.use("/api/v1", v1Router);
apiRouter.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    // tslint:disable-next-line:no-console
    console.error(err);
    res.sendStatus(500);
});
