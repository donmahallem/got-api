/*!
 * Source https://github.com/donmahallem/got-api
 */

import * as nconf from "nconf";

export class Config {
    private static _nconf: nconf.Provider

    /**
     * gets the port for the server
     */
    public static get port(): number {
        return Config.nconf.get("port");
    }

    /**
     * gets the reddit client id
     */
    public static get redditClientId(): string {
        return Config.nconf.get("reddit:client_id");
    }

    public static set redditClientId(redditClientId: string) {
        // TODO
    }

    /**
     * gets the reddit client secret
     */
    public static get redditClientSecret(): string {
        return Config.nconf.get("reddit:client_secret");
    }

    public static get redditRedirectUri(): string {
        return Config.nconf.get("reddit:redirect_uri");
    }
    public static set redditRedirectUri(redditRedirectUri: string) {
        // TODO
    }
    public static get cookiesSecure(): boolean {
        return Config.nconf.get("cookies:secure");
    }
    public static set cookiesSecure(redditRedirectUri: boolean) {
        // TODO
    }

    public static get jwtSecret(): string {
        return Config.nconf.get("jwt:secret");
    }

    public static get jwtIssuer(): string {
        return Config.nconf.get("jwt:issuer");
    }
    private static get nconf(): nconf.Provider {
        if (Config._nconf === undefined) {
            Config._nconf = new nconf.Provider({});
            Config._nconf.file("config.json");
            Config._nconf.defaults({
                "cookies": {
                    "secure": true,
                },
            });
            Config._nconf.argv({
                "p": {
                    alias: "port",
                    demand: true,
                    describe: "The port to listen on",
                    type: "number",
                },
            });
            Config._nconf.required(["reddit:client_id",
                "reddit:client_secret",
                "port"]);
        }
        return Config._nconf;
    }

    public static loadFile(file: string) {
        Config._nconf.file(file);
    }
}