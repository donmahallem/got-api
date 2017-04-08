import * as express from "express";
import { ConfigEndpoints } from "./config.endpoints";


let router: express.Router = express.Router();
router.get("", ConfigEndpoints.getConfig);
export = router;