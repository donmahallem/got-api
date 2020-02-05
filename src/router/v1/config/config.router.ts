/*!
 * Source https://github.com/donmahallem/got-api
 */

import * as express from "express";
import { ConfigEndpoints } from "./config.endpoints";

const router: express.Router = express.Router();
router.get("", ConfigEndpoints.getConfig);
export = router;