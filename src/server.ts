import * as express from "express";
import * as http from "http";
import * as bodyParser from "body-parser";
import * as serveStatic from "serve-static";
import * as cookieParser from "cookie-parser";
import { Config } from "./config";

import * as api from "./router/api";

export class GotServer {
    private app: express.Application;
    private http: http.Server;
    constructor() {
        this.app = express();
        this.http = http.createServer(this.app);
        this.app.use(bodyParser.json());
        this.app.use(api);
    }

    public start() {
        this.http.listen(Config.port, () => {
            console.log("Server listening on port " + Config.port + "!");
        });
    }
}