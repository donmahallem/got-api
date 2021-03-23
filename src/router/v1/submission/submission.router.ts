/*!
 * Source https://github.com/donmahallem/got-api
 */

import express from "express";
import { SubmissionEndpoints } from "./submission.endpoints";

const router: express.Router = express.Router();
router.get("/me", SubmissionEndpoints.getMe);
router.get("/:id", SubmissionEndpoints.getUser);
export = router;
