/*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */

import * as express from "express";
import * as redditRouter from "./oauth/reddit";

let apiRouter = express.Router();
apiRouter.use("/api", redditRouter);
export = apiRouter;
