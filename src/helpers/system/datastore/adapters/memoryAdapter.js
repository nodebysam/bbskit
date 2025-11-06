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
 * In-memory adapter (no persistence). Meets adapter contract.
 */
export class MemoryAdapter {
    /**
     * Create a new instance of MemoryAdapter.
     */
    constructor() {
        this._m = new Map();
    }

    /**
     * Get a value for given key from the datastore.
     * 
     * @param {string} key - The name of the key to get value for.
     * @returns {Promise<*>} A promise that resolves to the value of the given key.
     */
    async get(key) {
        return this._m.get(key);
    }

    /**
     * Set a key in the datastore.
     * 
     * @param {string} key - The name of the key to set.
     * @param {*} value - The value to set.
     */
    async set(key, value) {
        this._m.set(key, value);
    }

    /**
     * Delete a key from the datstore.
     * 
     * @param {string} key - The name of the key to delete.
     * @returns {Promise<boolean>} A promise that resolves to a boolean (true if deleted successfully, false otherwise).
     */
    async delete(key) {
        return this._m.delete(key);
    }
    
    /**
     * Check if the datastore has a given key.
     * 
     * @param {string} key - The name of the key to check.
     * @returns {Promise<boolean>} A promise that resolves to a boolean (true if datastore has the key, false if not).
     */
    async has(key) {
        return this._m.has(key);
    }

    /**
     * Clear out the datastore of all data.
     * Warning: this action is not reversable.
     */
    async clear() {
        this._m.clear();
    }

    /**
     * Get the array of keys in the datastore.
     * 
     * @returns {Promise<string[]>} A promise that resolves to an array of keys that are in the datastore.
     */
    async keys() {
        return Array.from(this._m.keys());
    }

    /**
     * Get the current size of the datastore.
     * 
     * @returns {Promise<number>} A promise that resolves to the size of the datastore.
     */
    async size() {
        return this._m.size;
    }

    /**
     * Retrieve multiple keys from the in-memory store.
     * 
     * @param {string[]} keys - An array of keys as strings to fetch. 
     * @returns {Promise<any[]>} A promise that resolves to an array of wrapped values, aligned
     *                           with the order of the provided keys.
     * 
     * @example
     * await adapter.mget(["user:1", "user:2"]);
     * // → [ { v: "Alice", e: null }, undefined ]
     */
    async mget(keys) {
        return keys.map((k) => this._m.get(k));
    }

    /**
     * Set multiple key-value pairs in the in-memory store.
     * 
     * @param {[string, any][]} entries - An array of `[key, value]` pairs to store.
     *                                    Each value should already be wrapped in the `{ v,  e}` format used by DataStore.
     * @returns {Promise<void>} A promise that resolves when all entries have been set.
     * 
     * @example
     * await adapter.mset([
     *      ["user:1", { v: "Alice", e: null }],
     *      ["user:2", { v: "Bob", e: null }]
     * ]);
     */
    async mset(entries) {
        for (const [k, v] of entries) this._m.set(k, v);
    }

    /**
     * 
     * @param {string} key - The key whose numeric value to increment.
     * @param {number} [delta=1] - The amount to increase (or decrease if negative) (default is 1).
     * @returns {Promise<number>} A promise resolving to the new numeric value after increment.
     * 
     * @example
     * await adapter.set("counter", { v: 10, e: null });
     * await adapter.incr("counter", 5);
     * // → 15
     * 
     * await adapter.incr("newCounter");
     * // → 1 (key did not exist, created at 1) 
     */
    async incr(key, delta = 1) {
        const curr = this._m.get(key);
        const currVal = curr?.v ?? 0;
        const next = Number(currVal) + Number(delta);

        const ttl = curr?.e != null ? (curr.e - Date.now()) : null;
        const wrapped = { v: next, e: ttl == null ? null : Date.now() + ttl };

        this._m.set(key, wrapped);
        return next;
    }
}