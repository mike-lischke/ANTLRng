/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { java } from "./java/java";
import { JavaEqualityComparator } from "./JavaEqualityComparator";

import { HashableArray, MurmurHash } from "./MurmurHash";
import { IEquatable } from "./types";

/**
 * A class implementing Java's comparison semantics, which are based on object equality, that is, equality based on
 * hash codes generated for an object. Simple types are compared directly (value/reference comparison), with
 * NaN !== NaN and null !== undefined.
 */
export class DefaultJavaEqualityComparator<T> implements JavaEqualityComparator<T> {
    public static readonly instance = new DefaultJavaEqualityComparator();

    public hashCode = (obj?: unknown): number => {
        // This method uses `hashCode()` of the given object if that actually supports this.
        return MurmurHash.valueHash(obj);
    };

    public equals = (a: T, b: T): boolean => {
        if (a === b) {
            return true;
        }

        if (a == null || b == null) {
            return false;
        }

        if (this.isEquatable(a)) {
            return a.equals(b);
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
