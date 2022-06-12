/* java2ts: keep */

import { IEquatable } from "../../../../../../../lib/types";

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/*
 eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/naming-convention, no-redeclare,
 max-classes-per-file, jsdoc/check-tag-names, @typescript-eslint/no-empty-function,
 @typescript-eslint/restrict-plus-operands, @typescript-eslint/unified-signatures, @typescript-eslint/member-ordering,
 no-underscore-dangle, max-len
*/

/* cspell: disable */

/**
 *
 * @author Sam Harwell
 */
export class MurmurHash {

    private static readonly DEFAULT_SEED: number = 0;

    /**
     * Initialize the hash using the default seed value.
     *
     *
     * @returns the intermediate hash value
     */
    public static initialize(): number;
    /**
     * Initialize the hash using the specified {@code seed}.
     *
     * @param seed the seed
     *
     * @returns the intermediate hash value
     */
    public static initialize(seed: number): number;
    public static initialize(seed?: number): number {
        if (seed === undefined) {
            return MurmurHash.initialize(MurmurHash.DEFAULT_SEED);
        } else {
            return seed;
        }
    }

    /**
     * Update the intermediate hash value for the next input {@code value}.
     *
     * @param hash the intermediate hash value
     * @param value the value to add to the current hash
     *
     * @returns the updated intermediate hash value
     */
    public static update(hash: number, value: number): number;
    /**
     * Update the intermediate hash value for the next input {@code value}.
     *
     * @param hash the intermediate hash value
     * @param value the value to add to the current hash
     *
     * @returns the updated intermediate hash value
     */
    public static update(hash: number, value?: string | IEquatable): number;
    public static update(hash: number, value?: number | string | IEquatable): number {
        if (typeof hash === "number" && typeof value === "number") {
            const c1 = 0xCC9E2D51;
            const c2 = 0x1B873593;
            const r1 = 15;
            const r2 = 13;
            const m = 5;
            const n = 0xE6546B64;

            let k: number = value;
            k = k * c1;
            k = (k << r1) | (k >>> (32 - r1));
            k = k * c2;

            hash = hash ^ k;
            hash = (hash << r2) | (hash >>> (32 - r2));
            hash = hash * m + n;

            return hash;
        } else {
            let newValue = 0;
            if (value) {
                if (typeof value === "number") {
                    newValue = value;
                } else if (typeof value === "string") {
                    newValue = this.hashString(value);
                } else {
                    newValue = value.hashCode();
                }
            }

            return MurmurHash.update(hash, newValue);
        }

    }

    /**
     * Apply the final computation steps to the intermediate value {@code hash}
     * to form the final result of the MurmurHash 3 hash function.
     *
     * @param hash the intermediate hash value
     * @param numberOfWords the number of integer values added to the hash
     *
     * @returns the final hash result
     */
    public static finish = (hash: number, numberOfWords: number): number => {
        hash = hash ^ (numberOfWords * 4);
        hash = hash ^ (hash >>> 16);
        hash = hash * 0x85EBCA6B;
        hash = hash ^ (hash >>> 13);
        hash = hash * 0xC2B2AE35;
        hash = hash ^ (hash >>> 16);

        return hash;
    };

    /**
     * Utility function to compute the hash code of an array using the
     * MurmurHash algorithm.
     *
     * @param data the array data
     * @param seed the seed for the MurmurHash algorithm
     *
     * @returns the hash code of the data
     */
    public static hashCode = <T extends number | string | IEquatable>(data: T[], seed: number): number => {
        let hash = this.initialize(seed);
        for (const value of data) {
            if (typeof value === "number") {
                hash = this.update(hash, value);
            } else {
                hash = this.update(hash, value);
            }
        }

        hash = this.finish(hash, data.length);

        return hash;
    };

    /**
     * Function to hash a string. Based on the implementation found here:
     * https://stackoverflow.com/a/52171480/1137174
     *
     * @param str The string to hash.
     * @param seed An optional seed for the operation.
     *
     * @returns The computed hash.
     */
    private static hashString(str: string, seed = 0): number {
        let h1 = 0xdeadbeef ^ seed;
        let h2 = 0x41c6ce57 ^ seed;
        for (let i = 0; i < str.length; i++) {
            const ch = str.charCodeAt(i);
            h1 = Math.imul(h1 ^ ch, 2654435761);
            h2 = Math.imul(h2 ^ ch, 1597334677);
        }
        h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
        h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);

        return 4294967296 * (2097151 & h2) + (h1 >>> 0);
    }

    private constructor() {
    }
}
