/**
 * BBSKit
 * A NodeJS bulletin board system kit that provides various
 * useful helpers for building a bulletin board system.
 * 
 * By Sam Wilcox aka NodeBySam
 * https://github.com/nodebysam/bbskit
 * 
 * BBSKit is released under the MIT license.
 * For further details, please see the LICENSE file in the
 * root directory.
 */

import { describe, it, expect } from "vitest";
import { validateEmail } from "../../../src/helpers/validation/validateEmail";

/**
 * Unit tests for unit testing the validation/validateEmail method.
 */
describe("validateEmail()", () => {
    it("returns true for a normal email", () => {
        expect(validateEmail("user@example.com")).toBe(true);
    });

    it ("returns false for missing domain", () => {
        expect(validateEmail("user@")).toBe(false);
    });

    it("returns false for missing @", () => {
        expect(validateEmail("userexample.com")).toBe(false);
    });

    it("handles uppercase domains and dots", () => {
        expect(validateEmail("USER.NAME@Example.CO")).toBe(true);
    });

    it("trims spaces automatically", () => {
        expect(validateEmail("   space@example.com")).toBe(true);
    });

    it("returns false for non-string input", () => {
        expect(validateEmail(null)).toBe(false);
        expect(validateEmail(undefined)).toBe(false);
        expect(validateEmail(1234)).toBe(false);
    });

    it("returns false for invalid characters", () => {
        expect(validateEmail("user@@example.com")).toBe(false);
        expect(validateEmail("user!@example.com")).toBe(false);
    });
});