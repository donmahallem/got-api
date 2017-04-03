const https = require("https");
function RedditFeed(subreddit) {
    const subredditName = subreddit;
    this.timeoutRef = null;
    this.requestLimit = 10;
    this.intervalTime = 10 * 1000;
    this.callback = null;
    this.idBuffer = [];
    self = this;
}

import { Observable } from "rxjs/Observable";
export type RedditThing = {
    id: string;
}

RedditFeed.prototype.start = function (listen) {
    if (this.timeoutRef == null) {
        this.callback = listen;
        this.timeoutRef = setInterval(this.poll, this.intervalTime);
    } else {
        console.log("interval already started");
    }
};

RedditFeed.prototype.stop = function () {
    if (this.timeoutRef != null) {
        clearInterval(this.timeoutRef);
        this.timeoutRef = null;
    } else {
        console.log("interval not started");
    }
};


module.exports = RedditFeed;