
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