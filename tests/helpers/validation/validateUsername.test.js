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
import { validateUsername, createUsernameValidator } from "../../../src/helpers/validation/validateUsername";

const baseRules = {
    min: 3,
    max: 12,
    allowed: /^[A-Za-z0-9_-]+$/,
    startsWith: /^[A-Za-z0-9]/,
    endsWith: /[A-Za-z0-9]$/,
    noConsecutive: ["_", "-"],
    normalize: (s) => s.trim(),
    disallow: [/admin/i],
    custom: [(s) => (s.toLowerCase() === "root" ? "reserved:root" : undefined)]
};

/**
 * Unit tests for validating the validateUsername method.
 */
describe("validateUsername (rule-driven)", () => {
    it("accepts a valid username", () => {
        const r = validateUsername("johndoe", baseRules);
        expect(r.ok).toBe(true);
        expect(r.reasons).toStrictEqual([]);
        expect(r.value).toBe("johndoe");
    });

    it("rejects too short or too long", () => {
        expect(validateUsername("ab", baseRules).ok).toBe(false);
        expect(validateUsername("a".repeat(13), baseRules).ok).toBe(false);
    });

    it("rejects invalid characters", () => {
        const r = validateUsername("john!", baseRules);
        expect(r.ok).toBe(false);
        expect(r.reasons).toContain("invalid_chars");
    });

    it ("rejects bad start or end", () => {
        expect(validateUsername("-john", baseRules).reasons).toContain("bad_start");
        expect(validateUsername("john-", baseRules).reasons).toContain("bad_end"); 
    });

    it("rejects consecutive disallowed chars", () => {
        const r = validateUsername("john__doe", baseRules);
        expect(r.ok).toBe(false);
        expect(r.reasons).toContain("consecutive:_");
    });

    it("rejects disallowed patterns", () => {
        const r = validateUsername("admin-user", baseRules);
        expect(r.ok).toBe(false);
        expect(r.reasons.join(",")).toMatch(/disallowed_pattern/);
    });

    it("applies custom validators", () => {
        const r = validateUsername("root", baseRules);
        expect(r.ok).toBe(false);
        expect(r.reasons).toContain("reserved:root");
    });

    it("supports reusable validator factory", () => {
        const validate = createUsernameValidator(baseRules);
        expect(validate("johndoe").ok).toBe(true);
    });

    it("whitelist overrides failures", () => {
        const rules = { ...baseRules, whitelist: new Set(["admin"]) };
        const r = validateUsername("admin", rules);
        expect(r.ok).toBe(true);
        expect(r.reasons).toStrictEqual([]);
    });

    it("returns not_a_string for non-strings", () => {
        const r = validateUsername(null, baseRules);
        expect(r.ok).toBe(false);
        expect(r.reasons).toContain("not_a_string");
    });

    it("returns true for a valid username with default rules", () => {
        const r = validateUsername("johndoe");
        expect(r.ok).toBe(true);
        expect(r.reasons).toStrictEqual([]);
    });
});