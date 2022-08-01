/*
 * This file is released under the MIT license.
 * Copyright (c) 2021, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

/* eslint-disable @typescript-eslint/naming-convention */

export interface ListIterator<T> {
    /**
     * Inserts the specified element into the list (optional operation).
     */
    add(e: T): void;

    /**
     * Returns true if this list iterator has more elements when traversing the list in the forward direction.
     */
    hasNext(): boolean;

    /**
     * Returns true if this list iterator has more elements when traversing the list in the reverse direction.
     */
    hasPrevious(): boolean;

    /**
     * Returns the next element in the list and advances the cursor position.
     */
    next(): T;

    /**
     * Returns the index of the element that would be returned by a subsequent call to next().
     */
    nextIndex(): number;

    /**
     * Returns the previous element in the list and moves the cursor position backwards.
     */
    previous(): T;

    /**
     * Returns the index of the element that would be returned by a subsequent call to previous().
     */
    previousIndex(): number;

    /**
     * Removes from the list the last element that was returned by next() or previous() (optional operation).
     */
    remove(): void;

    /**
     * Replaces the last element returned by next() or previous() with the specified element (optional operation).
     */
    set(e: T): void;

}
