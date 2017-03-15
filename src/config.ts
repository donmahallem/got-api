import * as nconf from "nconf";

export class Config {
    private static _nconf: nconf.Provider
    private static get nconf(): nconf.Provider {
        if (Config._nconf == null) {
            Config._nconf = new nconf.Provider({});
            Config._nconf.file("config.json");
            Config._nconf.defaults({
                "port": 80,
                "reddit": {
                    "clientId": null,
                    "clientSecret": null
                }
            });
        }
        return Config._nconf;
    }

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
        return Config.nconf.get("reddit:clientId");
    }

    /**
     * gets the reddit client secret
     */
    public static get redditClientSecret(): string {
        return Config.nconf.get("reddit:clientSecret");
    }

    public static get redditRedirectUri(): string {
        return Config.nconf.get("reddit:redirectUri");
    }

    public static get jwtSecret(): string {
        return Config.nconf.get("jwt:secret");
    }

    public static get jwtIssuer(): string {
        return Config.nconf.get("jwt:issuer");
    }
}