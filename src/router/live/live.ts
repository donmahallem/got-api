import * as express from "express";
import {
    RedditHelper,
    Scope
} from "./../../util/reddit-helper";
import {
    Auth,
    JwtBody
} from "./../../util/auth";
import * as redis from "redis";

let router: express.Router = express.Router();
router.get("/live", (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.writeHead(200, "Ok", {
        "Content-Type": "text/event-stream"
    });
    res.write("event: ping\ndata: pong\n\n");
    let aborted: boolean = false;
    const finish: Function = (error?: Error) => {
        sub.quit()
        res.end()
    };
    let sub = redis.createClient();
    req.on("close", finish);
    req.on("error", finish);
    sub.on("message", function (channel, message) {
        let submission: { id: string } = JSON.parse(message);
        res.write("event: submission\n");
        res.write("id: " + parseInt(submission.id, 36) + "\n");
        res.write("data: ");
        res.write(message);
        res.write("\n\n");
    });
    sub.subscribe("reddit:submission");
});
export = router;
