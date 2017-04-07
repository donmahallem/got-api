/*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */

import * as express from "express";
import * as v1UserRouter from "./user/user.router";
import * as v1SubmissionRouter from "./submission/submission.router";
import * as redditRouter from "./reddit/reddit.router";

let apiRouter = express.Router();
apiRouter.use("/reddit", redditRouter);
apiRouter.use("/user", v1UserRouter);
apiRouter.use("/submission", v1SubmissionRouter);
export = apiRouter;
