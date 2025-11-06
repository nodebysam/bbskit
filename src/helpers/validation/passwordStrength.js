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
 * Evaluate the strength of a password based on configurale criteria.
 * 
 * Default rules:
 * - Minimum length: 8
 * - Checks for lowercase, uppercase, number, and symbol
 * - Bonus points for longer passwords and diversity of characters
 * 
 * Returns an object containing:
 * - score (0-4)
 * - label ("weak", "fair", "strong", "very_strong")
 * - reasons: array of feedbqck messages.
 * 
 * @param {string} password - The password to evaluate.
 * @param {Object} [rules={}] - Optional rules override.
 * @param {number} [rules.minLength=8] - The minimum character length the password must be (default is 8).
 * @param {number} [rules.maxLength=128] - The maximum character length the password must not exceed (default is 128).
 * @param {boolean} [rules.requireLowercase=true] - True to require lowercase characters, false not to (default is true).
 * @param {boolean} [rules.requireUppercase=true] - True to require uppercase characters, false not to (default is true).
 * @param {boolean} [rules.requireNumber==true] - True to require numeric characters, false not to (default is true).
 * @param {boolean} [rules.requireSymbol=true] - True to require symbols, false not to (default is true).
 * @returns {{ score: number, label: string, reasons: string[] }}
 * 
 * @example
 * passwordStrength("abc"); // → { score: 1, label: "weak", reasons: [...] }
 * passwordStrength("Abc123!@#"); // → { score: 4, label: "very_strong", reasons: [] }
 */
export function passwordStrength(password, rules = {}) {
    if (typeof password !== 'string') {
        return {
            score: 0,
            label: "invalid",
            reasons: ["not_a_string"],
        };
    }

    const { 
        minLength = 8,
        maxLength = 128,
        requireLowercase = true,
        requireUppercase = true,
        requireNumber = true,
        requireSymbol = true,
    } = rules;

    const reasons = [];
    let score = 0;

    if (password.length < minLength) reasons.push("too_short");
    if (password.length > maxLength) reasons.push("too_long");

    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);

    // Enforce the rules
    if (requireLowercase && !hasLower) reasons.push("missing_lowercase");
    if (requireUppercase && !hasUpper) reasons.push("missing_uppercase");
    if (requireNumber && !hasNumber) reasons.push("missing_number");
    if (requireSymbol && !hasSymbol) reasons.push("missing_symbol");

    // Scoring system (0-4)
    score += hasLower ? 1 : 0;
    score += hasUpper ? 1 : 0;
    score += hasNumber ? 1 : 0;
    score += hasSymbol ? 1 : 0;

    // Length bonuses
    if (password.length >= 12) score++;
    if (password.length >= 16) score++;

    // Need to cap the score between 0 and 4
    score = Math.min(score, 4);

    const labels = ["weak", "fair", "good", "strong", "very_strong"];
    let label = labels[score];

    // Override label if clearly too short or too long
    if (password.length < minLength) label = "weak";
    if (password.length > maxLength) label = "weak";

    return { score, label, reasons };
}