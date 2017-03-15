import { Auth } from "./auth";
import { expect } from "chai";
// if you used the "@types/mocha" method to install mocha type definitions, uncomment the following line
import "mocha";

describe("Hello function", () => {
    it("should return hello world", () => {
        expect(Auth.tt()).to.be.true;
    });
});