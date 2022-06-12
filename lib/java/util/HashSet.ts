/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE file for more info.
 */

import hash_sum from "hash-sum";

import { Collection } from "./Collection";
import { Cloneable } from "../lang/Cloneable";

export class HashSet<T> extends Cloneable implements Collection<T>, Iterable<T> {
    private set: Set<T>;

    // Constructs a new set containing the elements in the specified collection.
    public constructor(c?: Collection<T> | Iterator<T>);
    // Constructor here only for compatibility. Parameters have no effect.
    public constructor(initialCapacity: number, loadFactor?: number);
    public constructor(collectionOrInitialCapacity?: Collection<T> | Iterator<T> | number, _loadFactor?: number) {
        super();

        if (collectionOrInitialCapacity && typeof collectionOrInitialCapacity !== "number") {
            if (this.isCollection(collectionOrInitialCapacity)) {
                this.set = new Set(collectionOrInitialCapacity);
            } else {
                this.set = new Set();

                let current = collectionOrInitialCapacity.next();
                while (!current.done) {
                    this.set.add(current.value as T);
                    current = collectionOrInitialCapacity.next();
                }
            }
        } else {
            this.set = new Set();
        }
    }

    public [Symbol.iterator](): Iterator<T> {
        return this.set[Symbol.iterator]();
    }

    // Adds the specified element to this set if it is not already present.
    public add(e: T): boolean {
        if (this.set.has(e)) {
            return false;
        }

        this.set.add(e);

        return true;
    }

    public addAll(c: Collection<T>): boolean {
        let changed = false;
        for (const element of c) {
            if (!this.set.has(element)) {
                changed = true;
            }

            this.set.add(element);
        }

        return changed;
    }

    // Removes all of the elements from this set.
    public clear(): void {
        this.set.clear();
    }

    // Returns true if this set contains the specified element.
    public contains(e: T): boolean {
        return this.set.has(e);
    }

    public containsAll(c: Collection<T>): boolean {
        for (const element of c) {
            if (!this.set.has(element)) {
                return false;
            }
        }

        return true;
    }

    public equals(other: Collection<T>): boolean {
        return this.set.size === other.size() && this.containsAll(other);
    }

    public hashCode(): number {
        return parseInt(hash_sum(this.set), 16);
    }

    public removeAll(c: Collection<T>): boolean {
        let result = false;

        for (const element of c) {
            if (this.set.has(element)) {
                this.set.delete(element);
                result = true;
            }
        }

        return result;
    }

    public retainAll(c: Collection<T>): boolean {
        let result = false;

        for (const element of this.set) {
            if (!c.contains(element)) {
                this.set.delete(element);
                result = true;
            }
        }

        return result;
    }

    // Returns true if this set contains no elements.
    public isEmpty(): boolean {
        return this.set.size === 0;
    }

    // Removes the specified element from this set if it is present.
    public remove(e: T): boolean {
        return this.set.delete(e);
    }

    // Returns the number of elements in this set (its cardinality).
    public size(): number {
        return this.set.size;
    }

    public toArray(): T[] {
        return [...this.set.values()];
    }

    private isCollection(value: unknown): value is Collection<T> {
        return (value as Collection<T>).size !== undefined;
    }
}
