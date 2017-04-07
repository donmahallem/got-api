import * as express from "express";
import { RedditEndpoints } from "./reddit.endpoints";


let router: express.Router = express.Router();
router.get("/signin", RedditEndpoints.signin);
router.get("/authorize", RedditEndpoints.authorize);
export = router;
