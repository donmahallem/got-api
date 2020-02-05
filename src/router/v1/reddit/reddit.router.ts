/*!
 * Source https://github.com/donmahallem/got-api
 */

import * as express from "express";
import { RedditEndpoints } from "./reddit.endpoints";

const router: express.Router = express.Router();
router.get("/signin", RedditEndpoints.signin);
router.get("/authorize", RedditEndpoints.authorize);
router.get("/live", RedditEndpoints.getLive);
export = router;
