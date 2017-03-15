/*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */

import * as express from "express";
import * as redditAuth from "./oauth/reddit";

let router = express.Router();
router.use("/api", redditAuth);
export = router;
