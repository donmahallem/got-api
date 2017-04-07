import { GotServer } from "./server";
import { Config } from "./config";

//let ArgumentParser = argparse.ArgumentParser;
let server: GotServer = new GotServer();
server.start();