import * as express from "express";
import * as http from "http";
import * as bodyParser from "body-parser";
import * as serveStatic from "serve-static";
import * as cookieParser from "cookie-parser";

import * as api from "./router/api";

export class PursonalServer {
    private app: express.Application;
    private http: http.Server;
    private readonly port: number;
    constructor(port: number = 80) {
        this.port = port;
        this.app = express();
        this.http = http.createServer(this.app);
        this.app.use(bodyParser.json());
        this.app.use(api);
        this.app.use(function (err, req, res, next) {
            console.log("Request errored", err);
        });
    }

    public start() {
        this.http.listen(this.port, () => {
            console.log("Server listening on port " + this.port + "!");
        });
    }
}