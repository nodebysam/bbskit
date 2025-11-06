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
 * Truncate text to a given length, optionally preserving whole words.
 * 
 * @param {string} text - The text to truncate.
 * @param {number} length - The mximum length (in characters). 
 * @param {Object} [options={}] - Optional options for truncating a string,
 * @param {boolean} [options.wordSafe] - True to not cut off words, false to allow to cut off words.
 * @param {string} [options.ellipsis='...'] - The ellipsis to append at the end of the truncated string.
 * @returns {string} The truncated string. 
 * 
 * @example
 * truncate("Hello world, this is a test.", 10);
 * // → "Hello wor..."
 * 
 * truncate("Hello world, this is a test.", 10, { wordSafe: true });
 * // → "Hello..."
 */
export function truncate(text, length, options = {}) {
    if (typeof text !== 'string') return '';
    if (length <= 0) return '';
    const { wordSafe = false, ellipsis = '...' } = options;

    if (text.length <= length) return text;

    let truncated = text.slice(0, length);

    if (wordSafe) {
        // We backtrack here to the last space to avoid cutting off words mid-way
        const lastSpace = truncated.lastIndexOf(" ");
        if (lastSpace > 0) truncated = truncated.slice(0, lastSpace);
    }

    return truncated.trimEnd() + ellipsis;
};

module.exports = { truncate };