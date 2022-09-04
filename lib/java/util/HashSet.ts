/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-returns */

import { java } from "../java";

import { Collection } from "./Collection";
import { DefaultJavaEqualityComparator } from "../../DefaultJavaEqualityComparator";
import { MurmurHash } from "../../MurmurHash";
import { JavaEqualityComparator } from "../../JavaEqualityComparator";

/**
 * This implementation was taken from the ANTLR4 Array2DHashSet implementation and adjusted to fulfill the
 * more general Java HashSet implementation (supporting null as valid value).
 */
export class HashSet<T> implements java.lang.Cloneable<HashSet<T>>, java.io.Serializable,
    Collection<T>, Iterable<T>, java.util.Set<T> {

    public static readonly initialCapacity = 16; // Must be a power of 2.
    public static readonly defaultLoadFactor = 0.75;

    protected comparator: JavaEqualityComparator<T> = DefaultJavaEqualityComparator.instance;

    // How many elements in set.
    private n = 0;

    private buckets: Array<Array<T | undefined>>;

    // When to expand.
    private threshold: number;
    private loadFactor: number;

    public constructor(c?: Collection<T>);
    public constructor(initialCapacity: number, loadFactor?: number);
    public constructor(cOrInitialCapacity?: Collection<T> | number, loadFactor?: number) {
        let initialCapacity = HashSet.initialCapacity;

        if (cOrInitialCapacity === undefined) {
            loadFactor ??= HashSet.defaultLoadFactor;

            this.buckets = new Array<T[]>(initialCapacity).fill(undefined);
        } else if (typeof cOrInitialCapacity === "number") {
            if (!loadFactor || loadFactor < 0 || loadFactor > 1) {
                loadFactor = HashSet.defaultLoadFactor;
            }

            // Make the initial capacity a power of 2.
            initialCapacity = Math.pow(2, Math.ceil(Math.log2(cOrInitialCapacity)));
            this.buckets = new Array<T[]>(initialCapacity).fill(undefined);
        } else {
            initialCapacity = cOrInitialCapacity.size();
            loadFactor = HashSet.defaultLoadFactor;
            this.buckets = new Array<T[]>(initialCapacity).fill(undefined);

            this.addAll(cOrInitialCapacity);
        }

        this.loadFactor = loadFactor;
        this.threshold = Math.floor(initialCapacity * loadFactor);
    }

    public *[Symbol.iterator](): IterableIterator<T> {
        yield* this.toArray();
    }

    /**
     * Add `o` to set if not there; return existing value if already
     * there. This method performs the same operation as {@link add} aside from
     * the return value.
     *
     * @param o The element to add.
     *
     * @returns The passed in object.
     */
    public getOrAdd(o: T): T {
        if (this.n > this.threshold) {
            this.expand();
        }

        return this.getOrAddImpl(o);
    }

    public get(o: T): T | undefined {
        if (o === undefined) {
            return o;
        }

        const index = this.getBucketIndex(o);
        const bucket = this.buckets[index];
        if (bucket === undefined) {
            return undefined;
        }

        for (const e of bucket) {
            if (e === undefined) {
                // Empty slot; not there.
                return undefined;
            }

            if (this.comparator.equals(e, o)) {
                return e;
            }
        }

        return undefined;
    }

    /**
     * @returns the hash code value for this set. The hash code of a set is defined to be the sum of the hash codes
     *          of the elements in the set, where the hash code of a null element is defined to be zero.
     */
    public hashCode(): number {
        let hash = 0;
        for (const e of this) {
            hash += MurmurHash.valueHash(e);
        }

        return hash;
    }

    public equals(o: unknown): boolean {
        if (o === this) {
            return true;
        }

        if (!(o instanceof HashSet)) {
            return false;
        }

        if (o.size !== this.size) {
            return false;
        }

        return this.containsAll(o);
    }

    public add(t: T): boolean {
        return t === this.getOrAdd(t);
    }

    public size(): number {
        return this.n;
    }

    public isEmpty(): boolean {
        return this.n === 0;
    }

    public contains(o: T): boolean {
        if (o === undefined) {
            return false;
        }

        return this.get(o) !== undefined;
    }

    public toArray(): T[];
    public toArray<U extends T>(a: U[]): U[];
    public toArray<U extends T>(a?: U[]): T[] | U[] {
        if (a === undefined) {
            const a = new Array<T>(this.size()).fill(undefined);
            let i = 0;
            for (const bucket of this.buckets) {
                if (bucket === undefined) {
                    continue;
                }

                for (const o of bucket) {
                    if (o === undefined) {
                        break;
                    }

                    a[i++] = o;
                }
            }

            return a;
        } else {
            if (a.length < this.size()) {
                a = java.util.Arrays.copyOf(a, this.size());
            }

            let i = 0;
            for (const bucket of this.buckets) {
                if (bucket === undefined) {
                    continue;
                }

                for (const o of bucket) {
                    if (o === undefined) {
                        break;
                    }

                    a[i++] = o as U;
                }
            }

            return a;
        }
    }

    public remove(obj: T): boolean {
        if (obj === undefined) {
            return false;
        }

        const index = this.getBucketIndex(obj);
        const bucket = this.buckets[index];
        if (bucket === undefined) {
            // no bucket
            return false;
        }

        for (let i = 0; i < bucket.length; i++) {
            const e = bucket[i];
            if (e === undefined) {
                // Empty slot - not there.
                return false;
            }

            if (this.comparator.equals(e, obj)) {
                // Shift all elements to the right down one.
                java.lang.System.arraycopy(bucket, i + 1, bucket, i, bucket.length - i - 1);
                bucket[bucket.length - 1] = undefined;
                --this.n;

                return true;
            }
        }

        return false;
    }

    public containsAll(collection: java.util.Collection<T>): boolean {
        if (collection instanceof HashSet) {
            const s = collection as HashSet<T>;
            for (const bucket of s.buckets) {
                if (bucket === undefined) {
                    continue;
                }

                for (const o of bucket) {
                    if (o === undefined) {
                        break;
                    }

                    if (!this.contains(o)) {
                        return false;
                    }

                }
            }
        } else {
            for (const o of collection) {
                if (!this.contains(o)) {
                    return false;
                }

            }
        }

        return true;
    }

    public addAll(c: java.util.Collection<T>): boolean {
        let changed = false;
        for (const o of c) {
            const existing = this.getOrAdd(o);
            if (existing === o) {
                changed = true;
            }
        }

        return changed;
    }

    public retainAll(c: java.util.Collection<unknown>): boolean {
        let newSize = 0;
        for (const bucket of this.buckets) {
            if (bucket === undefined) {
                continue;
            }

            let i: number;
            let j: number;
            for (i = 0, j = 0; i < bucket.length; i++) {
                if (bucket[i] === undefined) {
                    break;
                }

                if (!c.contains(bucket[i])) {
                    // removed
                    continue;
                }

                // keep
                if (i !== j) {
                    bucket[j] = bucket[i];
                }

                j++;
                newSize++;
            }

            newSize += j;

            while (j < i) {
                bucket[j] = undefined;
                j++;
            }
        }

        const changed = newSize !== this.n;
        this.n = newSize;

        return changed;
    }

    public removeAll(c: java.util.Collection<T>): boolean {
        let changed = false;
        for (const o of c) {
            changed ||= this.remove(o);
        }

        return changed;
    }

    public clear(): void {
        this.buckets.fill(undefined);
        this.n = 0;
    }

    /** @returns a shallow copy of this HashSet instance: the elements themselves are not cloned. */
    public clone(): HashSet<T> {
        const result = new HashSet<T>(this);

        return result;
    }

    public toString(): string {
        if (this.size() === 0) {
            return "{}";
        }

        const buf = new java.lang.StringBuilder();
        buf.append("{");
        let first = true;
        for (const bucket of this.buckets) {
            if (bucket === undefined) {
                continue;
            }

            for (const o of bucket) {
                if (o === undefined) {
                    break;
                }

                if (first) {
                    first = false;
                } else {
                    buf.append(", ");
                }

                buf.append(o.toString());
            }
        }
        buf.append("}");

        return buf.toString();
    }

    protected getOrAddImpl(o: T): T {
        const b = this.getBucketIndex(o);
        const bucket = this.buckets[b];

        if (bucket === undefined) {
            // New bucket.
            this.buckets[b] = [o];
            ++this.n;

            return o;
        }

        // Look for it in the bucket.
        for (const existing of bucket) {
            if (this.comparator.equals(existing, o)) {
                return existing; // found existing, quit
            }
        }

        // Full bucket, expand and add to end.
        bucket.push(o);
        ++this.n;

        return o;
    }

    protected getBucketIndex(o: T): number {
        return this.comparator.hashCode(o) & (this.buckets.length - 1);
    }

    protected expand(): void {
        const old = this.buckets;

        const newCapacity = 2 * this.buckets.length;
        this.buckets = new Array<T[]>(newCapacity).fill(undefined);
        this.threshold = newCapacity * this.loadFactor;

        // Rehash all existing entries.
        for (const bucket of old) {
            if (!bucket) {
                continue;
            }

            for (const o of bucket) {
                const b = this.getBucketIndex(o);
                let newBucket = this.buckets[b];
                if (!newBucket) {
                    newBucket = [];
                    this.buckets[b] = newBucket;
                }

                newBucket.push(o);
            }
        }
    }
}
