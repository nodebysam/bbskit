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

import { describe, it, expect } from 'vitest';
import { truncate } from '../../../src/helpers/core/truncate';

/**
 * Unit tests for testing the core/truncate method.
 */
describe("truncate()", () => {
    it("shortens text to the given length", () => {
        const result = truncate("Hello world", 5);
        expect(result).toBe("Hello...");
    });

    it ("preserves whole words when wordSafe is true", () => {
        const result = truncate("Hello world", 8, { wordSafe: true });
        expect(result).toBe("Hello...");
    });

    it ("returns text unchanged if it is shorter than limit", () => {
        const result = truncate("Hi", 10);
        expect(result).toBe("Hi");
    });

    it ("supports custom ellipsis strings", () => {
        const result = truncate("abcdef", 4, { ellipsis: ">>>" });
        expect(result).toBe("abcd>>>");
    });

    it("handles non-string input gracefully", () => {
        expect(truncate(null, 10)).toBe("");
        expect(truncate(undefined, 10)).toBe("");
        expect(truncate(12345, 3)).toBe("");
    });

    it("returns empty string when length <= 0", () => {
        const result = truncate("Hello world", 0);
        expect(result).toBe("");
    });

    it("handles wordSafe truncation correctly when no space exists", () => {
        const result = truncate("Supercalifragilistic", 10, { wordSafe: true });
        expect(result).toBe("Supercalif...");
    });

    it("functions properly when wordSafe is true and using custom ellipsis", () => {
        const result = truncate("One word and two words.", 10, { wordSafe: true, ellipsis: "---" });
        expect(result).toBe("One word---");
    });
});