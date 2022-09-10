/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { java } from "../java";

import { JavaEqualityComparator } from "../../JavaEqualityComparator";
import { HashableArray, MurmurHash } from "../../MurmurHash";
import { HashMapEntry } from "./HashMapEntry";
import { IEquatable } from "../../types";

/**
 * A specialized comparator implementation for hash maps. It only takes key values in the entries into account.
 */
export class HashMapEqualityComparator<K, V> implements JavaEqualityComparator<HashMapEntry<K, V>> {
    public static readonly instance = new HashMapEqualityComparator();

    /**
     * Computes the hash code of the key of the given hash map entry.
     *
     * @param value The hash map entry for which to compute the key hash.
     *
     * @returns The computed hash code.
     */
    public hashCode = (value: HashMapEntry<K, V>): number => {
        return MurmurHash.valueHash(value.getKey());
    };

    /**
     * Determines the equality of two hash map entries (considering only their keys).
     *
     * @param a First value to compare.
     * @param b Second value to compare.
     *
     * @returns True if both are equal, otherwise false.
     */
    public equals = (a: HashMapEntry<K, V>, b: HashMapEntry<K, V>): boolean => {
        const key1 = a.getKey();
        const key2 = b.getKey();
        if (a === b || key1 === key2) {
            return true;
        }

        // If we have primitive values and they failed the equality check above then they cannot be equal.
        // No need to compute hash codes for them.
        if (typeof key1 === "boolean" || typeof key1 === "number" || typeof key1 === "string") {
            return false;
        }

        if (this.isEquatable(key1) && this.isEquatable(key2)) {
            return key1.equals(key2);
        }

        if (Array.isArray(key1) && Array.isArray(key2)) {
            // Assuming here arrays were given which can be hashed.
            return java.util.Arrays.equals(key1 as HashableArray, key2 as HashableArray);
        }

        return this.hashCode(a) === this.hashCode(b);
    };

    /**
     * A variation of the normal equals method to compare a hash map entry's value against a given value.
     *
     * @param a The has map entry to compare.
     * @param value The value for comparison.
     *
     * @returns True if the entry's value equals the given value, otherwise false.
     */
    public equalsValue = (a: HashMapEntry<K, V>, value: V): boolean => {
        const value1 = a.getValue();
        if (value1 === value) {
            return true;
        }

        if (typeof value1 === "boolean" || typeof value1 === "number" || typeof value1 === "string") {
            return false;
        }

        if (this.isEquatable(value1) && this.isEquatable(value)) {
            return value1.equals(value);
        }

        if (Array.isArray(value1) && Array.isArray(value)) {
            return java.util.Arrays.equals(value1 as HashableArray, value as HashableArray);
        }

        return MurmurHash.valueHash(value1) === MurmurHash.valueHash(value);
    };

    private isEquatable(candidate: unknown): candidate is IEquatable {
        return (candidate as IEquatable).equals !== undefined;
    }
}
