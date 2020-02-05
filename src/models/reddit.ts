/*!
 * Source https://github.com/donmahallem/got-api
 */


export type RedditUser = {
    is_employee?: boolean;
    name: string;
    created: number;
    is_suspended: boolean;
    created_utc: number;
    link_karma: number;
    comment_karma: number;
    id: string;
    has_verified_email: boolean;
    inbox_count: boolean;
}

export interface RedditThing {
    id: string;
}

export interface RedditSelftext extends RedditThing {
    selftext: string;
    selftext_html: string;
}

export interface RedditSubmission extends RedditThing {
}

export enum RedditThingType {
    COMMENT = 1,
    ACCOUNT = 2,
    LINK = 3,
    MESSAGE = 4,
    SUBREDDIT = 5,
    AWARD = 6,
    PROMO_CAMPAIGN = 8,
}

export type RedditResponse<T> = {
    type: string;
    data: T;
}

export interface RedditListing<T extends RedditThing> {
    before?: string | null;
    after?: string | null;
    children: T[];
}

export interface RedditSubmissionListing extends RedditListing<RedditSubmission> {

}

export type ExchangeTokenResponse = {
    /**
     * access_token for api access
     */
    access_token: string;
    /**
     * if requested the refresh token
     */
    refresh_token?: string;
    /**
     * token type
     */
    token_type: string;
    /**
     * time in seconds until the access_token expires
     */
    expires_in: number;
    /**
     * space seperated list of scopes
     */
    scope: string;
}