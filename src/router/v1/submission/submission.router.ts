/*!
 * Source https://github.com/donmahallem/got-api
 */

import express from "express";
import { SubmissionEndpoints } from "./submission.endpoints";

export const submissionRouter: express.Router = express.Router();
submissionRouter.get("/me", SubmissionEndpoints.getMe);
submissionRouter.get("/:id", SubmissionEndpoints.getUser);
