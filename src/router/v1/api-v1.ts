/*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */

import * as express from "express";
import * as arcticleRoute from "./article";
import * as storeRoute from "./store";

let router = express.Router();
router.use("/v1", arcticleRoute);
router.use("/v1", storeRoute);
export = router;
