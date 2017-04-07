import * as express from "express";
import { SubmissionEndpoints } from "./submission.endpoints";


let router: express.Router = express.Router();
router.get("/me", SubmissionEndpoints.getMe);
router.get("/:id", SubmissionEndpoints.getUser);
export = router;
