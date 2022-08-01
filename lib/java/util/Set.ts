/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { Collection } from "./Collection";

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface Set<T> extends Iterable<T> {
    /** Adds the specified element to this set if it is not already present (optional operation). */
    add(e: T): boolean;

    /**
     * Adds all of the elements in the specified collection to this set if they're not already present
     * (optional operation).
     */
    addAll(c: Collection<T>): boolean;

    /** Removes all of the elements from this set (optional operation). */
    clear(): void;

    /** Returns true if this set contains the specified element. */
    contains(o: unknown): boolean;

    /** Returns true if this set contains all of the elements of the specified collection. */
    containsAll(c: Collection<T>): boolean;

    /** Compares the specified object with this set for equality. */
    equals(o: unknown): boolean;

    /** Returns the hash code value for this set. */
    hashCode(): number;

    /** Returns true if this set contains no elements. */
    isEmpty(): boolean;

    /** Removes the specified element from this set if it is present (optional operation). */
    remove(o: unknown): boolean;

    /**
     * Removes from this set all of its elements that are contained in the specified collection (optional operation).
     */
    removeAll(c: Collection<T>): boolean;

    /** Retains only the elements in this set that are contained in the specified collection (optional operation). */
    retainAll(c: Collection<T>): boolean;

    /** Returns the number of elements in this set (its cardinality). */
    size(): number;

    /** Returns an array containing all of the elements in this set. */
    toArray(): T[];

    /**
     * Returns an array containing all of the elements in this set; the runtime type of the returned array is that
     * of the specified array.
     */
    toArray<T2>(a: T2[]): T2[];
}
