import * as express from "express";
import {
    RedditHelper,
    Scope
} from "./../../util/reddit-helper";
import {
    Auth,
    JwtBody
} from "./../../util/auth";

let router = express.Router();
router.get("/reddit", (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.redirect(RedditHelper.createAuthorizeUrl([Scope.IDENTITY], "random"));
    res.end();
});
router.get("/reddit/authorize", (req: express.Request, res: express.Response, next: express.NextFunction) => {
    RedditHelper.exchangeCode(req.query.code)
        .then((data) => {
            return RedditHelper.getMe(data["access_token"])
        })
        .then((user) => {
            let body: JwtBody = {
                reddit: {
                    id: user.id,
                    name: user.name
                }
            }
            return Auth.sign(body);
        })
        .then((jwt) => {
            let cookieOptions: express.CookieOptions = {
                httpOnly: true,
                expires: new Date(Date.now() + (1000 * 3600 * 24))
            };
            res.cookie("X-AUTH-TOKEN", jwt, cookieOptions);
            res.redirect("/");
        })
        .catch((error) => {
            console.error(error);
            res.send("error");
        })

});
export = router;
