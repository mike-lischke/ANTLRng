/*
 * This file is released under the MIT license.
 * Copyright (c) 2021, 2022, Mike Lischke
 *
 * See LICENSE file for more info.
 */

import { ArrayList, List } from ".";

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
    public static equals<T>(a?: T[], a2?: T[]): boolean {
        if (!a && !a2) {
            return true;
        }

        if (a.length !== a2.length) {
            return false;
        }

        a.forEach((element, index) => {
            if (element !== a2[index]) {
                return false;
            }
        });

        return true;
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
        result = result.fill(null);
        result.splice(0, 0, ...original);

        return result;
    }
}

