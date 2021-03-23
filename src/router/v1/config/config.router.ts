/*!
 * Source https://github.com/donmahallem/got-api
 */

import express from "express";
import { ConfigEndpoints } from "./config.endpoints";

export const configRouter: express.Router = express.Router();
configRouter.get("", ConfigEndpoints.getConfig);
