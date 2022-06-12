/*
 * This file is released under the MIT license.
 * Copyright (c) 2021, Mike Lischke
 *
 * See LICENSE file for more info.
 */

/* eslint-disable @typescript-eslint/naming-convention */

import { Collection, ListIterator } from ".";

export abstract class List<T> implements Iterable<T>, Collection<T> {

    // For list that represent ranges of other lists.
    protected start = 0;
    protected end = 0;

    public [Symbol.iterator](): Iterator<T> {
        let index = this.start;

        return {
            next: () => {
                return {
                    done: index === this.end,
                    value: this.get(index++),
                };
            },
        };
    }

    /**
     * Appends the specified element to the end of this list.
     */
    public abstract add(e: T): boolean;

    /**
     * Inserts the specified element at the specified position in this list.
     */
    public abstract add(index: number, element: T): void;

    /**
     * Appends all of the elements in the specified collection to the end of this list, in the order that they are
     * returned by the specified collection's iterator.
     */
    public abstract addAll(c: Collection<T>): boolean;

    /**
     * Inserts all of the elements in the specified collection into this list at the specified position.
     */
    public abstract addAll(index: number, c: Collection<T>): boolean;

    /**
     * Removes all of the elements from this list.
     */
    public abstract clear(): void;

    /**
     * Returns true if this list contains the specified element.
     */
    public abstract contains(element: T): boolean;

    /**
     * Returns true if this list contains all of the elements of the specified collection.
     */
    public abstract containsAll(c: Collection<T>): boolean;

    /**
     * Compares the specified object with this list for equality.
     */
    public abstract equals(other: List<T>): boolean;

    /**
     * Returns the element at the specified position in this list.
     */
    public abstract get(index: number): T;

    /**
     * Returns the hash code value for this list.
     */
    public abstract hashCode(): number;

    /**
     * Returns the index of the first occurrence of the specified element in this list, or -1 if this list does not
     * contain the element.
     */
    public abstract indexOf(o: T): number;

    /**
     * Returns true if this list contains no elements.
     */
    public abstract isEmpty(): boolean;

    /**
     * Returns an iterator over the elements in this list in proper sequence.
     */
    public abstract iterator(): Iterator<T>;

    /**
     * Returns the index of the last occurrence of the specified element in this list, or -1 if this list does not
     * contain the element.
     */
    public abstract lastIndexOf(o: T): number;

    /**
     * Returns a list iterator over the elements in this list (in proper sequence), starting at the specified
     * position in the list (or 0 if no index is given).
     */
    public abstract listIterator(index?: number): ListIterator<T>;

    /**
     * Removes the element at the specified position in this list.
     */
    public abstract remove(index: number): T;

    /**
     * Removes the first occurrence of the specified element from this list, if it is present.
     */
    public abstract remove(o: T): boolean;

    /**
     * Removes from this list all of its elements that are contained in the specified collection.
     */
    public abstract removeAll(c: Collection<T>): boolean;

    /**
     * Retains only the elements in this list that are contained in the specified collection.
     */
    public abstract retainAll(c: Collection<T>): boolean;

    /**
     * Replaces the element at the specified position in this list with the specified element.
     */
    public abstract set(index: number, element: T): T;

    /**
     * Returns the number of elements in this list.
     */
    public abstract size(): number;

    /**
     * Returns a view of the portion of this list between the specified fromIndex, inclusive, and toIndex, exclusive.
     */
    public abstract subList(fromIndex: number, toIndex: number): List<T>;

    /**
     * Returns an array containing all of the elements in this list in proper sequence (from first to last element).
     */
    public abstract toArray(): T[];

    /**
     * Returns an array containing all of the elements in this list in proper sequence (from first to last element);
     * the runtime type of the returned array is that of the specified array.
     */
    public abstract toArray<T2>(a: T2[]): T2[];

}
