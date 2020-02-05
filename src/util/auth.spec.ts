/*!
 * Source https://github.com/donmahallem/got-api
 */

import { expect } from "chai";
// if you used the "@types/mocha" method to install mocha type definitions, uncomment the following line
import "mocha";
import { Auth } from "./auth";

describe("Hello function", () => {
    it("should return hello world", () => {
        expect(Auth).to.not.equal(undefined);
    });
});