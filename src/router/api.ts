/*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */

import * as express from "express";
import * as redditRouter from "./oauth/reddit";
import * as redditLiveRouter from "./live/live";

let apiRouter = express.Router();
apiRouter.use("/api", redditRouter);
apiRouter.use("/api/reddit", redditLiveRouter);
apiRouter.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log("Request errored", err)
    res.sendStatus(500);
});
export = apiRouter;
