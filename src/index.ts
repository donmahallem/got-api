/*!
 * Source https://github.com/donmahallem/got-api
 */

import { GotServer } from "./server";

// let ArgumentParser = argparse.ArgumentParser;
const server: GotServer = new GotServer();
server.start();