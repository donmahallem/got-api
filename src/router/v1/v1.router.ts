/*!
 * Source https://github.com/donmahallem/got-api
 */

/*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */

import express from "express";
import { authRouter } from "./auth/auth.router";
import { configRouter } from "./config/config.router";
import { redditRouter } from "./reddit/reddit.router";
import { submissionRouter as v1SubmissionRouter } from "./submission/submission.router";
import { userRouter as v1UserRouter } from "./user/user.router";

export const apiRouter: express.Router = express.Router();
apiRouter.use("/reddit", redditRouter);
apiRouter.use("/user", v1UserRouter);
apiRouter.use("/submission", v1SubmissionRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/config", configRouter);
