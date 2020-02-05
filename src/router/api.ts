/*!
 * Source https://github.com/donmahallem/got-api
 */

/*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */

import * as express from "express";
import * as v1Router from "./v1/v1.router";

const apiRouter = express.Router();
apiRouter.use("/api/v1", v1Router);
apiRouter.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err);
    res.sendStatus(500);
});
export = apiRouter;
