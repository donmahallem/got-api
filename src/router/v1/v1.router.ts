/*!
 * Source https://github.com/donmahallem/got-api
 */

/*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */

import * as express from "express";
import * as authRouter from "./auth/auth.router";
import * as configRouter from "./config/config.router";
import * as redditRouter from "./reddit/reddit.router";
import * as v1SubmissionRouter from "./submission/submission.router";
import * as v1UserRouter from "./user/user.router";

const apiRouter = express.Router();
apiRouter.use("/reddit", redditRouter);
apiRouter.use("/user", v1UserRouter);
apiRouter.use("/submission", v1SubmissionRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/config", configRouter);
export = apiRouter;
