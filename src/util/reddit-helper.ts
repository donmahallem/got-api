/*!
 * Source https://github.com/donmahallem/got-api
 */

import * as https from "https";
import { Config } from "./../config";
import {
    ExchangeTokenResponse,
    RedditSubmissionListing,
    RedditUser,
} from "./../models/reddit";
export enum Scope {
    IDENTITY = 1,
    EDIT = 2,
    FLAIR = 3,
    HISTORY = 4,
    MODCONFIG = 5,
    MODFLAIR = 6,
    MODLOG = 7,
    MODPOSTS = 8,
    MODWIKI = 9,
    MYSUBREDDITS = 10,
    PRIVATEMESSAGES = 11,
    READ = 12,
    REPORT = 13,
    SAVE = 14,
    SUBMIT = 15,
    SUBSCRIBE = 16,
    VOTE = 17,
    WIKIEDIT = 18,
    WIKIREAD = 19,
};

type Scopes = Scope[];

export enum Duration {
    PERMANENT = 1,
    TEMPORARY = 2,
};
export class RedditHelper {
    // https://www.reddit.com/api/v1/authorize?client_id=CLIENT_ID&response_type=TYPE&state=RANDOM_STRING&redirect_uri=URI&duration=DURATION&scope=SCOPE_STRING

    public static scopesToString(scopes: Scopes): string {
        return scopes.map(scope => Scope[scope].toLowerCase()).join(",");
    }

    public static exchangeCode(code: string): Promise<ExchangeTokenResponse> {
        return new Promise((resolve, reject) => {
            const options: https.RequestOptions = {
                headers: {
                    Authorization: "Basic " + new Buffer(Config.redditClientId + ":" + Config.redditClientSecret).toString("base64"),
                },
                host: 'www.reddit.com',
                method: 'POST',
                path: '/api/v1/access_token',
                port: 443,
            };
            const req = https.request(options, (res) => {
                let body = "";
                res.setEncoding('utf8');
                res.on('data', (chunk) => {
                    body += chunk;
                });
                res.on("error", (error) => {
                    reject(error);
                });
                res.on("end", () => {
                    resolve(JSON.parse(body));
                });
            });
            req.write("grant_type=authorization_code&code=" + code + "&redirect_uri=" + Config.redditRedirectUri);
            req.end();
        });
    }

    public static getMe(token: string): Promise<RedditUser> {
        return new Promise((resolve, reject) => {
            const options: https.RequestOptions = {
                headers: {
                    Authorization: "Bearer " + token,
                    "User-Agent": "GoTrade Live Feed",
                },
                host: 'oauth.reddit.com',
                method: 'GET',
                path: '/api/v1/me',
                port: 443,
            };
            const req = https.request(options, (res) => {
                let body = "";
                res.setEncoding('utf8');
                res.on('data', (chunk) => {
                    body += chunk;
                });
                res.on("error", (error) => {
                    reject(error);
                });
                res.on("end", () => {
                    resolve(JSON.parse(body));
                });
            });
            req.end();
        });
    }

    public static getNewSubmissions(subreddit: string, limit: number = 10): Promise<RedditSubmissionListing> {
        return new Promise((resolve, reject) => {
            const options: https.RequestOptions = {
                headers: {
                    "User-Agent": "github.com/DonMahallem/got-api",
                },
                host: "api.reddit.com",
                path: "/r/" + subreddit + "/new?limit=" + limit,
                port: 443,
            };
            const request = https.get(options, (res) => {
                if (res.statusCode !== 200) {
                    reject(new Error("Status Code (" + res.statusCode + ") was returned"));
                    return;
                }
                let body = '';
                res.on('data', (chunk) => {
                    body += chunk;
                });
                res.on('end', () => {
                    const parsed = JSON.parse(body);
                    resolve(parsed);
                });
            });
            request.on('error', (e) => {
                reject(e);
            });
        });
    }

    public static createAuthorizeUrl(scopes: Scopes, state: string, duration: Duration = Duration.PERMANENT): string {
        return "https://www.reddit.com/api/v1/authorize?client_id=" + Config.redditClientId
            + "&response_type=code"
            + "&state=" + state
            + "&redirect_uri=" + Config.redditRedirectUri
            + "&duration=" + (duration === Duration.PERMANENT ? "permanent" : "temporary")
            + "&scope=" + RedditHelper.scopesToString(scopes);
    }
}
