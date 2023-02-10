/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { java, S } from "jree";

/**
 * A HashMap that remembers the order that the elements were added.
 *  You can alter the ith element with set(i,value) too :)  Unique list.
 *  I need the replace/set-element-i functionality so I'm subclassing
 *  LinkedHashSet.
 */
export class OrderedHashSet<T> extends java.util.LinkedHashSet<T> {
    /** Track the elements as they are added to the set */
    #elements = new java.util.ArrayList<T>();

    public get = (i: number): T | null => {
        return this.#elements.get(i);
    };

    /**
     * Replace an existing value with a new value; updates the element
     *  list and the hash table, but not the key as that has not changed.
     *
     * @param i index of element to replace
     * @param value new value
     *
     * @returns old value
     */
    public set = (i: number, value: T): T => {
        const oldElement: T = this.#elements.get(i);
        this.#elements.set(i, value); // update list
        super.remove(oldElement); // now update the set: remove/add
        super.add(value);

        return oldElement;
    };

    public remove(i: number): boolean;
    public remove(o: T): boolean;
    public remove(iOrO: number | T): boolean {
        if (typeof iOrO === "number") {
            const o = this.#elements.remove(iOrO);

            return super.remove(o);
        }
        else {
            throw new java.lang.UnsupportedOperationException();
        }
    }

    /**
     * Add a value to list; keep in hash table for consistency also;
     *  Key is object itself.  Good for say asking if a certain string is in
     *  a list of strings.
     *
     * @param value The value to add to the set.
     *
     * @returns `true` if the set did not already contain the specified element.
     */
    public add = (value: T): boolean => {
        const result: boolean = super.add(value);
        if (result) {  // only track if new element not in set
            this.#elements.add(value);
        }

        return result;
    };

    public clear = (): void => {
        this.#elements.clear();
        super.clear();
    };

    public hashCode = (): number => {
        return this.#elements.hashCode();
    };

    public equals = (o: java.lang.Object | null): boolean => {
        if (!(o instanceof OrderedHashSet<unknown>)) {
            return false;
        }

        const same = this.#elements !== null && this.#elements.equals((o as OrderedHashSet<unknown>).elements);

        return same;
    };

    public iterator = (): java.util.Iterator<T> => {
        return this.#elements.iterator();
    };

    /**
     * Return the List holding list of table elements. Note that you are
     *  NOT getting a copy so don't write to the list.
     * This is used instead of values() for efficiency.
     *
     * @returns The list of elements.
     */
    public elements = (): java.util.List<T> | null => {
        return this.#elements;
    };

    public clone = (): OrderedHashSet<T> => {
        const dup = super.clone() as OrderedHashSet<T>;
        dup.#elements = new java.util.ArrayList<T>(this.#elements);

        return dup;
    };

    public toArray = (): T[] => {
        return this.#elements?.toArray() ?? [];
    };

    public toString = (): java.lang.String => {
        return this.#elements?.toString() ?? S``;
    };
}
