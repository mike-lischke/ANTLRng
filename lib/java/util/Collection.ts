/*
 * This file is released under the MIT license.
 * Copyright (c) 2021, Mike Lischke
 *
 * See LICENSE file for more info.
 */

/* eslint-disable @typescript-eslint/naming-convention */

export interface Collection<T> {
    [Symbol.iterator](): Iterator<T>;

    /**
     * Ensures that this collection contains the specified element.
     */
    add(e: T): boolean;

    /**
     * Adds all of the elements in the specified collection to this collection.
     */
    addAll(c: Collection<T>): boolean;

    /**
     * Removes all of the elements from this collection.
     */
    clear(): void;

    /**
     * Returns true if this collection contains the specified element.
     */
    contains(o: T): boolean;

    /**
     * Returns true if this collection contains all of the elements in the specified collection.
     */
    containsAll(c: Collection<T>): boolean;

    /**
     * Compares the specified object with this collection for equality.
     */
    equals(other: Collection<T>): boolean;

    /**
     * Returns the hash code value for this collection.
     */
    hashCode(): number;

    /**
     * Returns true if this collection contains no elements.
     */
    isEmpty(): boolean;

    /**
     * Removes a single instance of the specified element from this collection, if it is present.
     */
    remove(o: T): boolean;

    /**
     * Removes all of this collection's elements that are also contained in the specified collection.
     */
    removeAll(c: Collection<T>): boolean;

    /**
     * Retains only the elements in this collection that are contained in the specified collection.
     */
    retainAll(c: Collection<T>): boolean;

    /**
     * Returns the number of elements in this collection.
     */
    size(): number;

    /**
     * Returns an array containing all of the elements in this collection.
     */
    toArray(): T[];

    /**
     * Returns an array containing all of the elements in this collection; the runtime type of the returned array
     * is that of the specified array.
     */
    toArray<T2>(a: T2[]): T2[];
}
