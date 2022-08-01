/*
 * This file is released under the MIT license.
 * Copyright (c) 2021, 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { ArrayList, List } from ".";
import { HashableArray, MurmurHash } from "../../MurmurHash";

export type ComparableValueType = number | bigint | string;

export class Arrays {
    public static sort<T>(list: T[]): void {
        list.sort((a, b) => {
            if (a < b) {
                return -1;
            }

            if (a > b) {
                return 1;
            }

            return 0;
        });
    }

    public static asList<T>(...list: T[]): List<T> {
        return new ArrayList<T>(list);
    }

    /**
     * Returns true if the two specified arrays are equal to one another. Two arrays are considered equal if both
     * arrays contain the same number of elements, and all corresponding pairs of elements in the two arrays are equal.
     * In other words, two arrays are equal if they contain the same elements in the same order.
     * Also, two array references are considered equal if both are null/undefined.
     *
     * @param a The array to compare against another array.
     * @param a2 The other array to compare to.
     *
     * @returns True if both arrays are equal, false otherwise.
     */
    public static equals(a?: HashableArray, a2?: HashableArray): boolean {
        if (a === a2) {
            return true; // Same object or both null/undefined.
        }

        if (!a || !a2) {
            return false;
        }

        if (a.length !== a2.length) {
            return false;
        }

        const hash1 = this.hashCode(a);
        const hash2 = this.hashCode(a2);

        return hash1 === hash2;
    }

    /**
     * Returns true if the two specified arrays are deeply equal to one another. Unlike the `equals()` method, this
     * method is appropriate for use with nested arrays of arbitrary depth.
     *
     * @param a The array to compare against another array.
     * @param a2 The other array to compare to.
     *
     * @returns True if both arrays are equal, false otherwise.
     */
    public static deepEquals(a?: HashableArray, a2?: HashableArray): boolean {
        if (a === a2) {
            return true; // Same object or both null/undefined.
        }

        if (!a || !a2) {
            return false;
        }

        if (a.length !== a2.length) {
            return false;
        }

        const hash1 = this.deepHashCode(a);
        const hash2 = this.deepHashCode(a2);

        return hash1 === hash2;
    }

    /**
     * Copies the specified array, truncating or padding with null (if necessary) so the copy has the specified length.
     * For all indices that are valid in both the original array and the copy, the two arrays will contain identical
     * values. For any indices that are valid in the copy but not the original, the copy will be undefined.
     * Such indices will exist if and only if the specified length is greater than that of the original array.
     *
     * @param original The array to be copied.
     * @param newLength The length of the copy to be returned.
     *
     * @returns A copy of the original array, truncated or padded with null to obtain the specified length.
     */
    public static copyOf<T>(original: T[], newLength: number): T[] {
        if (newLength < original.length) {
            return original.slice(0, newLength);
        }

        if (newLength === original.length) {
            return [...original];
        }

        let result = new Array<T>(newLength - original.length);
        result = result.fill(undefined);
        result.splice(0, 0, ...original);

        return result;
    }

    public static binarySearch<T extends ComparableValueType>(list: T[], value: T,): number;
    public static binarySearch<T extends ComparableValueType>(list: T[], start: number, end: number,
        value: T): number;
    public static binarySearch<T extends ComparableValueType>(list: T[], startOrValue: number | T, end?: number,
        value?: T): number {
        let start = 0;
        let stop = list.length;
        if (end !== undefined) {
            start = startOrValue as number;
            stop = end;
        }

        while (start < stop) {
            const mid = (stop + start) >> 1;
            if (value > list[mid]) {
                start = mid + 1;
            } else if (value < list[mid]) {
                stop = mid;
            } else {
                return mid;
            }
        }

        return -start - 1;
    }

    public static hashCode(a: HashableArray): number {
        let hash = MurmurHash.initialize(17);
        hash = MurmurHash.updateFromArray(hash, a, false);

        return MurmurHash.finish(hash, 1);
    }

    public static deepHashCode(a: HashableArray): number {
        let hash = MurmurHash.initialize(17);
        hash = MurmurHash.updateFromArray(hash, a, true);

        return MurmurHash.finish(hash, 1);
    }

    public static toString<T>(value: T[]): string {
        return JSON.stringify(value);
    }
}

