/* java2ts: keep */

import { IllegalArgumentException } from "../../../../../../lib/java/lang";
import { IEquatable } from "../../../../../../lib/types";

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

export type HashableType = string | number | boolean | IEquatable | ArrayLike<number>;

/**
 *
 * @author Sam Harwell
 */
export class MurmurHash {

    private static readonly DEFAULT_SEED = 0;

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
    public static update<T extends HashableType>(hash: number, value: T): number {
        let actualValue = 0;
        if (typeof value !== "number") {
            if (typeof value === "boolean") {
                actualValue = value ? 1 : 0;
            } else if (typeof value === "string") {
                actualValue = this.hashString(value, hash);
            } else if (this.isArrayLike(value)) {
                actualValue = this.hashArray(value, hash);
            } else if (this.isEquatable(value)) {
                actualValue = value.hashCode();
            } else {
                throw new IllegalArgumentException("Cannot generate a hash code for the given value");
            }
        } else {
            actualValue = value;
        }

        const c1 = 0xCC9E2D51;
        const c2 = 0x1B873593;
        const r1 = 15;
        const r2 = 13;
        const m = 5;
        const n = 0xE6546B64;

        actualValue = actualValue * c1;
        actualValue = (actualValue << r1) | (actualValue >>> (32 - r1));
        actualValue = actualValue * c2;

        hash = hash ^ actualValue;
        hash = (hash << r2) | (hash >>> (32 - r2));
        hash = hash * m + n;

        return hash;
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
        for (const c of str) {
            const ch = c.charCodeAt(0);
            h1 = Math.imul(h1 ^ ch, 2654435761);
            h2 = Math.imul(h2 ^ ch, 1597334677);
        }
        h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
        h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);

        return 4294967296 * (2097151 & h2) + (h1 >>> 0);
    }

    /**
     * A variation of the hashString method, but for arrays with numbers (including typed arrays).
     * This is more effective than running `update` for every entry individually.
     *
     * @param array The array to hash.
     * @param seed An optional seed for the operation.
     *
     * @returns The computed hash.
     */
    private static hashArray(array: ArrayLike<number>, seed = 0): number {
        let h1 = 0xdeadbeef ^ seed;
        let h2 = 0x41c6ce57 ^ seed;

        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < array.length; i++) {
            const ch = array[i];
            h1 = Math.imul(h1 ^ ch, 2654435761);
            h2 = Math.imul(h2 ^ ch, 1597334677);
        }
        h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
        h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);

        return 4294967296 * (2097151 & h2) + (h1 >>> 0);
    }

    private static isArrayLike(candidate: unknown): candidate is ArrayLike<number> {
        return (candidate as ArrayLike<number>).length !== undefined;
    }

    private static isEquatable(candidate: unknown): candidate is IEquatable {
        return (candidate as IEquatable).hashCode !== undefined;
    }

    private constructor() {
    }
}
