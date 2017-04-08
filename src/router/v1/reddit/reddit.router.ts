import * as express from "express";
import { RedditEndpoints } from "./reddit.endpoints";
import * as liveRouter from "./live/live.router";


let router: express.Router = express.Router();
router.get("/signin", RedditEndpoints.signin);
router.get("/authorize", RedditEndpoints.authorize);
router.get("/live", RedditEndpoints.getLive);
export = router;
