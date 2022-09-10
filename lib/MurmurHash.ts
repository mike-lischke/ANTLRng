/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { IEquatable } from "./types";

// bigint is left out on purpose here. It would require to compute bigint hashes, which would slow down the computation
// significantly.
export type HashableType = boolean | number | string | IEquatable | null;
export type HashableArray = Array<HashableType | HashableArray>;

/**
 * @author Sam Harwell
 * @author Mike Lischke
 */
export class MurmurHash {

    private static readonly defaultSeed = 0;

    private constructor() { /**/ }

    /**
     * Initialize the hash using the specified {@code seed}.
     *
     * @param seed the seed
     *
     * @returns the intermediate hash value
     */
    public static initialize(seed = MurmurHash.defaultSeed): number {
        return seed;
    }

    /**
     * Update the intermediate hash value for the next input {@code value}.
     *
     * @param hash The intermediate hash value.
     * @param value the value to add to the current hash.
     *
     * @returns the updated intermediate hash value
     */
    public static update(hash: number, value: unknown): number {
        let actualValue = 0;
        if (typeof value !== "number") {
            if (value != null) {
                if (typeof value === "boolean") {
                    actualValue = value ? 1237 : 4321;
                } else if (typeof value === "string") {
                    actualValue = this.hashString(hash, value);
                } else if (this.isEquatable(value)) {
                    actualValue = value.hashCode();
                }
            }
        } else {
            actualValue = Number.isNaN(value) ? 0 : value;
        }

        const c1 = 0xCC9E2D51;
        const c2 = 0x1B873593;
        const r1 = 15;
        const r2 = 13;
        const m = 5;
        const n = 0xE6546B64;

        actualValue = Math.imul(actualValue, c1);
        actualValue = (actualValue << r1) | (actualValue >>> (32 - r1));
        actualValue = Math.imul(actualValue, c2);

        hash = hash ^ actualValue;
        hash = (hash << r2) | (hash >>> (32 - r2));
        hash = Math.imul(hash, m) + n;

        return hash;
    }

    /**
     * An efficient hash method specifically for arrays, which does not go through the `update` method for each entry.
     * It's based on the `hashString` method and was extended to handle different array element types and even
     * nested arrays.
     *
     * @param hash The intermediate hash value.
     * @param array The array to hash. Make sure all elements in the array are of the same type. If you want deep
     *              hash computation then ensure that nested arrays are also of type `HashableArray`.
     *              The behavior of this method is undefined, if this condition is not met.
     * @param deep If true then nested arrays are recursively hashed as well, otherwise a simple hash is used for them.
     *
     * @returns The computed hash.
     */
    public static updateFromArray(hash: number, array: HashableArray, deep = false): number {
        let h1 = 0xdeadbeef ^ hash;
        let h2 = 0x41c6ce57 ^ hash;

        if (array.length > 0) {
            // All elements must be of the same type!
            const element = array[0];
            switch (typeof element) {
                case "number": {
                    for (const entry of array) {
                        const value = Number.isNaN(entry) ? 0 : entry as number;
                        h1 = Math.imul(h1 ^ value, 2654435761);
                        h2 = Math.imul(h2 ^ value, 1597334677);
                    }

                    break;
                }

                case "string": {
                    for (const entry of array) {
                        const value = MurmurHash.hashString(hash, entry as string);
                        h1 = Math.imul(h1 ^ value, 2654435761);
                        h2 = Math.imul(h2 ^ value, 1597334677);
                    }

                    break;
                }

                case "boolean": {
                    for (const entry of array) {
                        const value = (entry as boolean) ? 1237 : 4321;
                        h1 = Math.imul(h1 ^ value, 2654435761);
                        h2 = Math.imul(h2 ^ value, 1597334677);
                    }

                    break;
                }

                default: {
                    // If the first element is null/undefined assume all elements are null/undefined.
                    if (element != null) {
                        if (Array.isArray(element)) {
                            if (deep) {
                                for (const entry of array) {
                                    const value = this.updateFromArray(hash, entry as HashableArray, deep);
                                    h1 = Math.imul(h1 ^ value, 2654435761);
                                    h2 = Math.imul(h2 ^ value, 1597334677);
                                }
                            } else {
                                for (const entry of array) {
                                    let hash: number;
                                    if (Object.hasOwn(entry as HashableArray, "hash")) {
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        hash = (entry as any).hash as number;
                                    } else {
                                        // Generate an arbitrary number value as hash. The memory location would fit
                                        // better here, but that's impossible to get.
                                        hash = new Date().getTime();
                                        Object.defineProperty(entry, "hash", {
                                            value: hash,
                                            writable: false,
                                        });
                                    }

                                    h1 = Math.imul(h1 ^ hash, 2654435761);
                                    h2 = Math.imul(h2 ^ hash, 1597334677);
                                }
                            }
                        } else {
                            for (const entry of array) {
                                const value = (entry as IEquatable).hashCode();
                                h1 = Math.imul(h1 ^ value, 2654435761);
                                h2 = Math.imul(h2 ^ value, 1597334677);
                            }
                        }
                    }

                    break;
                }
            }

            h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
            h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
        }

        return 4294967296 * (2097151 & h2) + (h1 >>> 0);
    }

    /**
     * Apply the final computation steps to the intermediate value {@code hash}
     * to form the final result of the MurmurHash 3 hash function.
     *
     * @param hash The intermediate hash value.
     * @param entryCount The number of values added to the hash.
     *
     * @returns the final hash result
     */
    public static finish = (hash: number, entryCount: number): number => {
        hash ^= entryCount * 4;
        hash ^= hash >>> 16;
        hash = Math.imul(hash, 0x85EBCA6B);
        hash ^= hash >>> 13;
        hash = Math.imul(hash, 0xC2B2AE35);
        hash ^= hash >>> 16;

        return hash;
    };

    /**
     * A convenience method to hash a single value.
     *
     * @param value The value to hash.
     *
     * @returns The computed hash.
     */
    public static valueHash = (value: unknown): number => {
        if (value == null) {
            return MurmurHash.finish(MurmurHash.update(MurmurHash.defaultSeed, 0), 1);
        }

        if (this.isEquatable(value)) {
            return value.hashCode();
        }

        return MurmurHash.finish(MurmurHash.update(MurmurHash.defaultSeed, value), 1);
    };

    /**
     * Function to hash a string. Based on the implementation found here:
     * https://stackoverflow.com/a/52171480/1137174
     *
     * @param hash The intermediate hash value.
     * @param str The string to hash.
     *
     * @returns The computed hash.
     */
    private static hashString(hash = 0, str: string): number {
        let h1 = 0xdeadbeef ^ hash;
        let h2 = 0x41c6ce57 ^ hash;
        for (const c of str) { // Correctly iterate over surrogate pairs.
            const ch = c.charCodeAt(0);
            h1 = Math.imul(h1 ^ ch, 2654435761);
            h2 = Math.imul(h2 ^ ch, 1597334677);
        }
        h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
        h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);

        return Math.imul(4294967296, (2097151 & h2)) + (h1 >>> 0);
    }

    private static isEquatable(candidate: unknown): candidate is IEquatable {
        return (candidate as IEquatable).hashCode !== undefined;
    }

}
