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
 * Validate whether a string is a properly formatted email address.
 * 
 * @param {string} email - The email address to validate.
 * @returns {boolean} True if valid, false if not.'
 * 
 * @example
 * validateEmail("user@example.com") // → true
 * validateEmail("bad@") // → false
 */
export function validateEmail(email) {
    if (typeof email !== 'string') return false;
    const trimmed = email.trim();

    // This is inspired by RFC 5322
    const pattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

    return pattern.test(trimmed);
}