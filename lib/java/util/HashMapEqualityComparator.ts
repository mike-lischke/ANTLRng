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

    public hashCode = (value: HashMapEntry<K, V>): number => {
        return MurmurHash.valueHash(value.getKey());
    };

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

        if (Array.isArray(a) && Array.isArray(b)) {
            // Assuming here arrays were given which can be hashed.
            return java.util.Arrays.equals(a as HashableArray, b as HashableArray);
        }

        return this.hashCode(a) === this.hashCode(b);
    };

    private isEquatable(candidate: unknown): candidate is IEquatable {
        return (candidate as IEquatable).equals !== undefined;
    }
}
