/*!
 * Source https://github.com/donmahallem/got-api
 */

import * as express from "express";
import { GotMiddleware } from "./../../../util/";
import { UserEndpoints } from "./user.endpoints";

const router: express.Router = express.Router();
router.get("/me", GotMiddleware.authenticated, UserEndpoints.getMe);
router.get("/:id", UserEndpoints.getUser);
export = router;
