/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

/* eslint-disable jsdoc/require-returns */

import { java } from "../java";

import { Collection } from "./Collection";
import { JavaEqualityComparator } from "../../JavaEqualityComparator";
import { HashableType, MurmurHash } from "../../MurmurHash";

/**
 * This implementation was taken from the ANTLR4 Array2DHashSet implementation and adjusted to fulfill the
 * more general Java HashSet implementation (supporting null as valid value).
 */
export class HashSet<T extends HashableType> implements java.lang.Cloneable<HashSet<T>>, java.io.Serializable,
    Collection<T>, Iterable<T>, java.util.Set<T> {

    public static readonly initialCapacity = 15; // Prime number.
    public static readonly defaultLoadFactor = 0.75;

    protected comparator = JavaEqualityComparator.instance;

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

            // Make the initial capacity a (Mersenne) prime number.
            const temp = Math.ceil(Math.log2(cOrInitialCapacity));
            initialCapacity = Math.pow(2, temp) - 1;

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

    public get(o: T): T {
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

    public hashCode(): number {
        let hash: number = MurmurHash.initialize();
        for (const bucket of this.buckets) {
            if (bucket === undefined) {
                continue;
            }

            for (const o of bucket) {
                if (o === undefined) {
                    break;
                }

                hash = MurmurHash.update(hash, this.comparator.hashCode(o));
            }
        }

        hash = MurmurHash.finish(hash, this.size());

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
                // empty slot; not there
                return false;
            }

            if (this.comparator.equals(e, obj)) {
                // Shift all elements to the right down one.
                java.lang.System.arraycopy(bucket, i + 1, bucket, i, bucket.length - i - 1);
                bucket[bucket.length - 1] = undefined;
                this.n--;

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
            if (existing !== o) {
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
        this.buckets = new Array<T[]>(HashSet.initialCapacity).fill(undefined);
        this.n = 0;
        this.threshold = Number(Math.floor(HashSet.initialCapacity * this.loadFactor));
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
            this.n++;

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
        this.n++;

        return o;
    }

    protected getBucketIndex(o: T): number {
        return this.comparator.hashCode(o) & this.buckets.length;
    }

    protected expand(): void {
        const old = this.buckets;

        // Mersenne prime -> power of 2 -> double it -> new Mersenne prime.
        const newCapacity = ((this.buckets.length + 1) * 2) - 1;

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
