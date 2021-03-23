/*!
 * Source https://github.com/donmahallem/got-api
 */

import express from "express";
import { AuthEndpoints } from "./auth.endpoints";

const router: express.Router = express.Router();
router.post("/token", AuthEndpoints.token);
export = router;
