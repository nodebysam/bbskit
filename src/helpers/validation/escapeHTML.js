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

/**
 * Escape HTML special characters with configurable behavior.
 * 
 * Converts (by default):
 *      & → &amp;
 *      < → &lt;
 *      > → &gt;
 *      " → &quot;
 *      ' → &#39;
 * 
 * @param {string} input - The text to escape.
 * @param {Object} [options={}] - Options for escaping HTML.
 * @param {string|string[]} [options.extra=""] - Additional single characters to escape **in addition to** the defaults.
 *                                               Example: ``{ extra: "/`"} }`` and `` ` ``.
 * @param {string|string[]} [options.exclude=""] - Characters that should **not be escaped**, even if they are in the default set.
 *                                                 Example: ``{ exclude: "`"}`` will keep apostrophes (`'`) unescaped.
 * @param {Object.<string,string>>} [options.map={}] - A mapping of specific characters to custom HTML entities,
 *                                                     overriding or extending the defaults.
 *                                                     Example: ``{ map: { "`": "&apos;" } }`` will use `&apos; instead of `&#39;'.
 * @param {boolean} [options.preventDoubleEscape=true] - When true, existing entities (e.g., `&amp;` or `&#39;`)
 *                                                       are **left untouched** to prevent double-escaping.
 *                                                       When false, all `&` characters will be escaped again.
 * @returns {string} The escaped string, safe for HTML display.
 * 
 * @example
 * escapeHTML('<b>"Hello"&</b>');
 * // → "&lt;b&gt;&quot;Hellow&quot;&amp;&lt;/b&gt;"
 * 
 * escapeHTML("0'Reilly", { exclude: "'" });
 * // → ")'Reilly"
 * 
 * escapeHTML('Use `code` blocks', { extra: "`" });
 * // → "Use &grave;code&grave; blocks"
 * 
 * excapeHTML("&lt;safe&gt;", { preventDoubleEscape: false });
 * // → "&amp;lt;safe&amp;gt;"
 */
export function escapeHTML(input, options = {}) {
    if (typeof input !== "string") return '';

    const {
        extra = "",
        exclude = "",
        map = {},
        preventDoubleEscape = true,
    } = options;

    const baseMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
    };

    const entityMap = { ...baseMap, ...map };

    const toChars = (v) => (Array.isArray(v) ? v : Array.from(String(v)));
    const extraSet = new Set(toChars(extra));
    const excludeSet = new Set(toChars(exclude));

    const escapeSet = new Set(Object.keys(entityMap).concat([...extraSet]));
    for (const ch of excludeSet) escapeSet.delete(ch);

    if (escapeSet.size === 0) return input;

    const regexClass = [...escapeSet]
        .map((ch) => ch.replace(/[\\^$.*+?()[\]{}|]/g, "\\$&"))
        .join("");

    const pattern = new RegExp(`[${regexClass}]`, "g");

    if (!preventDoubleEscape) {
        return input.replace(pattern, (ch) => entityMap[ch] ?? ch);
    }

    return input.replace(/&(#\d+|#x[0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]+);|./g, (m) => {
        if (m.length > 1 && m[0] === "&" && m.endsWith(";")) return m;
        return m.replace(pattern, (ch) => entityMap[ch] ?? ch);
    });
}

/**
 * Create a reusable escaper bound to a specific configuration.
 * 
 * @param {Object} options - Same options as {@link escapeHTML}.
 * @returns {(input: string) => string} A function that escapes HtmL with the given options.
 * 
 * @example
 * const attrEscaper = createEscaper({ extra: "`=" });
 * // → "value=&grave;test&grave;"
 * @returns 
 */
export const createEscaper = (options) => (input) => escapeHTML(input, options);