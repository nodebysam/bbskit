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
 * Adapter Contract (all async):
 * - get(key): any | undefined
 * - set (key, value): void
 * - delete(key): boolean
 * - has(key): boolean
 * - clear(): void
 * - keys(): string[]
 * - size(): number
 * - mget(keys: string[]): any[]
 * - mset(entries: [key, value][]): void
 * - incr(key, delta = 1): number
 */

