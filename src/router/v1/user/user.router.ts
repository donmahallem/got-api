/*!
 * Source https://github.com/donmahallem/got-api
 */

import express from "express";
import { GotMiddleware } from "./../../../util/";
import { UserEndpoints } from "./user.endpoints";

export const userRouter: express.Router = express.Router();
userRouter.get("/me", GotMiddleware.authenticated, UserEndpoints.getMe);
userRouter.get("/:id", UserEndpoints.getUser);
