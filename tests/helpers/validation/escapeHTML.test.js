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
import { escapeHTML, createEscaper } from "../../../src/helpers/validation/escapeHTML";

/**
 * Unit tests to validate escapeHTML defaults.
 */
describe("escapeHTML (defaults)", () => {
    it("escapes &, <, >, \", and '", () => {
        const input = `<b onclick="x">& ' " </b>`;
        const out = escapeHTML(input);
        expect(out).toBe("&lt;b onclick=&quot;x&quot;&gt;&amp; &#39; &quot; &lt;/b&gt;");
    });

    it("returns empty string for non-string input", () => {
        expect(escapeHTML(null)).toBe("");
        expect(escapeHTML(undefined)).toBe("");
        expect(escapeHTML(123)).toBe("");
        expect(escapeHTML({})).toBe("");
    });

    it("leaves strings without special chars unchanged", () => {
        expect(escapeHTML("Hello world")).toBe("Hello world");
    });
});

/**
 * Unit tests to validate escapeHTML preventDoubleEscape option.
 */
describe("escapeHTML (preventDoubleEscape)", () => {
    it("does not double-escape entities by default", () => {
        const input = "&amp; &lt; &gt; &quot; &#39;";
        const out = escapeHTML(input);
        expect(out).toBe("&amp; &lt; &gt; &quot; &#39;");
    });

    it("can double-escape when disabled", () => {
        const input = "&lt; &gt;";
        const out = escapeHTML(input, { preventDoubleEscape: false });
        expect(out).toBe("&amp;lt; &amp;gt;");
    });

    it("escapes mixed text but preserves existing entities", () => {
        const input = "&lt;<span>&amp;</span>";
        const out = escapeHTML(input);
        expect(out).toBe("&lt;&lt;span&gt;&amp;&lt;/span&gt;");
    });
});

describe("escapeHMTL (options: extra, exclude, map)", () => {
    it("escapes extra characters", () => {
        const input = "a=b`c";
        const out = escapeHTML(input, { extra: "`=", map: { "=": "&equals;", "`": "&#96;" } });
        expect(out).toBe("a&equals;b&#96;c");
    });

    it("supports extra as array", () => {
        const input = "a=b";
        const out = escapeHTML(input, { extra: ["="], map: { "=": "&#61;" } });
        expect(out).toBe("a&#61;b"); 
    });

    it("excludes characters from escaping", () => {
        const input = `O'Reilly & "Media"`;
        const out = escapeHTML(input, { exclude: "'" });
        expect(out).toBe("O'Reilly &amp; &quot;Media&quot;");
    });

    it("map overrides default entity", () => {
        const input = `' " & < >`;
        const out = escapeHTML(input, { map: { "'": "&apos;" } });
        expect(out).toBe("&apos; &quot; &amp; &lt; &gt;");
    });

    it("handles regex metacharacters in extra safety", () => {
        const input = "price(100)|x";
        const out = escapeHTML(input, {
            extra: "()|",
            map: { "(": "&#40;", ")": "&#41;", "|": "&#124;" }
        });
        expect(out).toBe("price&#40;100&#41;&#124;x");
    });
});

/**
 * Unit tests for testing various edge cases of escapeHTML method.
 */
describe("escapeHTML (edge cases)", () => {
    it("returns input unchanged if escape set is empty (exclude all)", () => {
        const input = `<&>"'`;
        const out = escapeHTML(input, { exclude: `<&>"'` });
        expect(out).toBe(`<&>"'`);
    });

    it("works with createEscaper factory", () => {
        const attrEscaper = createEscaper({ extra: "`", map: { "`": "&#96;" } });
        const out = attrEscaper('value=`x` & y<z');
        expect(out).toBe("value=&#96;x&#96; &amp; y&lt;z");
    });

    it("mixed entities and raw chars: preserves entities, escapes raw", () => {
        const input = "5 &amp; 6 & 7 < 8 &gt;";
        const out = escapeHTML(input);
        expect(out).toBe("5 &amp; 6 &amp; 7 &lt; 8 &gt;");
    });
});