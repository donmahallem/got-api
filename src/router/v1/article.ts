/*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */

import * as express from "express";
let router = express.Router();
router.get("/article", (req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log(req.baseUrl);
    res.end();
});
router.delete("/article", (req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log(req.baseUrl);
    res.end();
});
router.put("/article", (req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log(req.baseUrl);
    res.end();
});
router.post("/article", (req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log(req.baseUrl);
    res.end();
});
export = router;
