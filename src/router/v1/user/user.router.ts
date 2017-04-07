import * as express from "express";
import { UserEndpoints } from "./user.endpoints";


let router: express.Router = express.Router();
router.get("/me", UserEndpoints.getMe);
router.get("/:id", UserEndpoints.getUser);
export = router;
