import { GotServer } from "./server";
import { Config } from "./config";
import { ArgumentParser } from "argparse";

//let ArgumentParser = argparse.ArgumentParser;
let parser = new ArgumentParser({
    version: "0.0.1",
    addHelp: true,
    description: "Argparse example"
});
parser.addArgument(
    ["-c", "--config"],
    {
        help: "Path to the config file",
        required: true
    }
);
var args = parser.parseArgs();
let server: GotServer = new GotServer();
server.start();