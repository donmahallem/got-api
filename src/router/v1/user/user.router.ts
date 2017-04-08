import * as express from "express";
import { UserEndpoints } from "./user.endpoints";
import { GotMiddleware } from "./../../../util/";


let router: express.Router = express.Router();
router.get("/me", GotMiddleware.authenticated, UserEndpoints.getMe);
router.get("/:id", UserEndpoints.getUser);
export = router;
