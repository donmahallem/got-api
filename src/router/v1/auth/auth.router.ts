/*!
 * Source https://github.com/donmahallem/got-api
 */

import express from "express";
import { AuthEndpoints } from "./auth.endpoints";

export const authRouter: express.Router = express.Router();
authRouter.post("/token", AuthEndpoints.token);
