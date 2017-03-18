import * as redditRouter from "./reddit";
import { expect } from "chai";
import * as express from "express";
import { RedditHelper } from "./../../util/reddit-helper";
import * as url from "url";
import * as supertest from "supertest";
// if you used the "@types/mocha" method to install mocha type definitions, uncomment the following line
import "mocha";
import * as sinon from "sinon";

describe("Reddit Oauth router", () => {
    describe("test router", () => {
        let app: express.Application;
        let errorRoute: express.ErrorRequestHandler;
        before(() => {
            errorRoute = (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
                res.sendStatus(400);
            };
            app = express();
            app.use(redditRouter);
            app.use(errorRoute);
        });
        after(() => {
        })
        describe("/reddit", () => {
            let stub: sinon.SinonStub;
            before(() => {
                stub = sinon.stub(RedditHelper, "createAuthorizeUrl").returns("http://test.com");
            });
            after(() => {
                expect(stub.calledOnce).to.be.true;
                stub.restore();
            })
            it("should redirect to the authorize url", () => {
                return supertest(app)
                    .get("/reddit")
                    .expect("Location", "http://test.com")
                    .expect(/Redirecting/)
                    .expect(302)
            });
        });
        describe("/reddit/authorize", () => {
            describe("no code provided", () => {
                it("should fail with 400", () => {
                    return supertest(app)
                        .get("/reddit/authorize")
                        .expect(400)
                });
            });
            describe("valid code provided", () => {
                let stub: sinon.SinonStub;
                before(() => {
                    stub = sinon.stub(RedditHelper, "exchangeCode").callsFake((code) => {
                        return Promise.resolve(code);
                    });
                });
                after(() => {
                    expect(stub.calledOnce).to.be.true;
                    stub.restore();
                })
                it("should fail with 400", () => {
                    return supertest(app)
                        .get("/reddit/authorize")
                        .query({ code: "value" })
                        .expect(302)
                });
            });
            describe("valid code provided", () => {
                let stub: sinon.SinonStub;
                before(() => {
                    stub = sinon.stub(RedditHelper, "exchangeCode").callsFake((code) => {
                        return Promise.reject(code);
                    });
                });
                after(() => {
                    expect(stub.calledOnce).to.be.true;
                    stub.restore();
                })
                it("should fail with 400", () => {
                    return supertest(app)
                        .get("/reddit/authorize")
                        .query({ code: "value" })
                        .expect(400)
                });
            });
        });
    });
});