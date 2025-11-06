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
import { passwordStrength } from "../../../src/helpers/validation/passwordStrength";

/**
 * Unit tests for validating the passwordStrength helper method.
 */
describe("passwordStrength()", () => {
    it("detects weak short passwords", () => {
        const result = passwordStrength("abc");
        expect(result.label).toBe("weak");
        expect(result.reasons).toContain("too_short");
    });

    it("recongizes mixed-case strong passwords", () => {
        const result = passwordStrength("Abc123!1");
        expect(result.label).toMatch(/good|strong|very_strong/);
    });

    it("reports missing character types", () => {
       const result = passwordStrength("abcdefg");
       expect(result.reasons).toContain("missing_uppercase");
       expect(result.reasons).toContain("missing_number");
       expect(result.reasons).toContain("missing_symbol"); 
    });

    it("handles overly long passwords", () => {
        const result = passwordStrength("a".repeat(200));
        expect(result.reasons).toContain("too_long");
    });

    it("allows rule overrides", () => {
        const result = passwordStrength("abc", { minLength: 2, requireSymbol: false });
        expect(result.label).not.toBe("invalid");
    });

    it("returns invalid for non-string inputs", () => {
        expect(passwordStrength(1234).label).toBe("invalid");
        expect(passwordStrength(null).label).toBe("invalid");
        expect(passwordStrength(undefined).label).toBe("invalid");
    });
});