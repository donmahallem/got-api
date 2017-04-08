import * as express from "express";
import { AuthEndpoints } from "./auth.endpoints";


let router: express.Router = express.Router();
router.post("/token", AuthEndpoints.token);
export = router;