/*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */

import * as express from "express";
import * as apiV1 from "./v1/api-v1";
import * as redditAuth from "./oauth/reddit";

let router = express.Router();
router.use("/api", apiV1);
router.use("/api", redditAuth);
export = router;
