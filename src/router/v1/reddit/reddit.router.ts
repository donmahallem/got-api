/*!
 * Source https://github.com/donmahallem/got-api
 */

import express from "express";
import { RedditEndpoints } from "./reddit.endpoints";

export const redditRouter: express.Router = express.Router();
redditRouter.get("/signin", RedditEndpoints.signin);
redditRouter.get("/authorize", RedditEndpoints.authorize);
redditRouter.get("/live", RedditEndpoints.getLive);
