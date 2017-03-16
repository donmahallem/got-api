import {
    RedditHelper,
    Scope
} from "./reddit-helper";
import { Config } from "./../config";
import { expect } from "chai";
import * as url from "url";
// if you used the "@types/mocha" method to install mocha type definitions, uncomment the following line
import "mocha";
import * as sinon from "sinon";

describe("Reddit Helper Tests", () => {
    describe("createAuthorizeUrl", () => {
        var clientIdStub: sinon.SinonStub;
        var clientRedirectStub: sinon.SinonStub;
        before(() => {/*
            let obj: any = {};
            Object.defineProperty(obj.prototype, 'redditClientId', {
                get: function () { return "client-id"; }
            });*/
            clientIdStub = sinon.stub(Config, "redditClientId", {
                get: function () { return "client-id"; }
            });
            clientRedirectStub = sinon.stub(Config, "redditRedirectUri", {
                get: function () { return "redirect_uri"; }
            });
        });
        after(() => {
            clientIdStub.restore();
            clientRedirectStub.restore();
        })
        it("should return correct query parameters", () => {
            let parsedUrl = url.parse(RedditHelper.createAuthorizeUrl([Scope.IDENTITY], "state"), true);
            expect(parsedUrl.query).to.deep.equal({
                client_id: "client-id",
                duration: "permanent",
                redirect_uri: "redirect_uri",
                response_type: "code",
                scope: "identity",
                state: "state"
            });
        });
    });
});