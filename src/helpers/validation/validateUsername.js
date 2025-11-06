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
 * @typedef {Object} UsernameRules
 * @property {number} [min=1] - Minimum character length.
 * @property {number} [max=64] - Maxium character length.
 * @property {RegExp} [allowed] - Regex that the entire username must match (e.g., /^[A-Za-z0-9_-]+$/)
 * @property {RegExp} [startsWith] - Regex that must match the first character(s)
 * @property {RegExp} [endsWith] - Regex that must mtch the last character(s).
 * @property {RegExp[]} [disallow] - Array of patterns that must not appear.
 * @property {string[]|Set<string>} [blacklist] - Exact values that are forbidden.
 * @property {string[]|Set<string>} [whitelist] - Exact values that are allowed (overrides other failures if matched).
 * @property {string[]|Set<string>} [noConsecutive] - Characters that must not repeat consecutely (e.g., ['_', '-']).
 * @property {{name: string => string}} [normalize] - Optional transformation before checks (e.g., s => s.trim().toLowerCase()).
 * @property {Array<name: string) => string|void|false>} [custom] - Custom validators; return a string (error message) if failing, otherwise void/false.
 * 
 * @typedef {Object} UsernameResult
 * @property {boolean} ok - True if all rules passed.
 * @property {string[]} reasons - List of human-readable failures.
 * @property {string} value - The normalized username (after 'normalize', if provided).
 */

/**
 * Validate a username against caller-supplied rules.
 * 
 * @param {string} username - The username to validate.
 * @param {UsernameRules} [rules={}] - The UsernameRules to use (omit to use default rules).
 * @returns {UsernameResult} - The UsernameResult for the given username.
 */
export function validateUsername(username, rules = {}) {
    const reasons = [];

    if (typeof username !== 'string') {
        return {
            ok: false,
            reasons: ["not_a_string"], value: "",
        };
    }

    const {
        min = 1,
        max = 64,
        allowed,
        startsWith,
        endsWith,
        disallow = [],
        blacklist,
        whitelist,
        noConsecutive,
        normalize,
        custom = [],
    } = rules;

    let value = normalize ? normalize(username) : username;

    // Check the whitelist
    if (whitelist && hasExact(whitelist, value)) {
        return {
            ok: true,
            reasons: [],
            value,
        };
    }

    // Check the length
    if (value.length < min)reasons.push("too_short");
    if (value.length > max) reasons.push("too_long");

    // Check for invalid characters
    if (allowed && !allowed.test(value)) reasons.push("invalid_chars");

    // Check start and endswith
    if (startsWith && !startsWith.test(value)) reasons.push("bad_start");
    if (endsWith && !endsWith.test(value)) reasons.push("bad_end");

    // Check for disallowed patterns
    for (const re of disallow) {
        if (re.test(value)) {
            reasons.push(`disallowed_pattern:${re.source}`);
        }
    }

    // Check the no consecutive rule
    if (noConsecutive && noConsecutive.length > 0) {
        for (const ch of noConsecutive) {
            const re = new RegExp(`${escapeRegExp(ch)}{2,}`);
            if (re.test(value)) reasons.push(`consecutive:${ch}`);
        }
    }

    // Check the blacklist
    if (blacklist && hasExact(blacklist, value)) {
        reasons.push("blacklisted");
    }

    // Custom validators
    for (const fn of custom) {
        try {
            const res = fn(value);
            if (typeof res === 'string' && res) reasons.push(res);
        } catch {
            reasons.push("custom_validator_error");
        }
    }

    return {
        ok: reasons.length === 0, reasons, value,
    };
}

/**
 * Create a reusable validator function bound to a fixed rule set.
 * 
 * @param {UsernameRules} rules - The UserName rules to use.
 * @returns {(username: string) => UsernameResult} - the UsernameResult for this validation.
 */
export function createUsernameValidator(rules) {
    return (name) => validateUsername(name, rules);
}

/**
 * Check if a given value exists in the array or set.
 * 
 * This utility supports both data structures so the caller can use
 * whichever is more convient for configuration (e.g., blacklist or whitelist).
 * 
 * @param {Array|string[]} listOrSet - An array of Set of values to check against. 
 * @param {string} value - The value to search for.
 * @returns {boolean} True if the value exists, false if not.
 * 
 * @example
 * 
 * hasExact(["admin", "root"], "admin"); // → true
 * hasExact(new Set("mod", "owner"]), "guest"); // → false
 */
const hasExact = (listOrSet, value) => {
    if (Array.isArray(listOrSet)) return listOrSet.includes(value);
    if (listOrSet instanceof Set) return listOrSet.has(value);
    return false;
};

/**
 * Escape special characters in a string so it can be safely inserted
 * into a regular expression pattern.
 * 
 * This prevents unintended regex behavior when dynamically constructing
 * patterns that include user-supplied characters.
 * 
 * @param {string} s - The string to escape for regex use.
 * @returns {string} The escaped string, safe for inclusion in a RegExp.
 * 
 * @example
 * const pattern = new RegExp(`^${exampeRegExp("file.name")}$);
 * // Matches only the literal "file.name".
 */
const escapeRegExp = (s) => {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};