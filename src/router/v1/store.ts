/*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */

import * as express from "express";
let router = express.Router();
router.get("/stores", (req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log(req.originalUrl);
    res.end();
});
router.get("/store/:id", (req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log(req.originalUrl);
    res.end();
});
router.delete("/store", (req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log(req.baseUrl);
    res.end();
});
router.put("/store", (req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log(req.baseUrl);
    res.end();
});
router.post("/store", (req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log(req.baseUrl);
    res.end();
});
export = router;
