/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable @typescript-eslint/naming-convention */

import { java, S, JavaObject, MurmurHash } from "jree";
import { ObjectEqualityComparator } from "./ObjectEqualityComparator";

import { EqualityComparator } from "./EqualityComparator";

/** {@link Set} implementation with closed hashing (open addressing). */
export class Array2DHashSet<T extends JavaObject> extends JavaObject implements java.util.Set<T> {
    public static readonly INITIAL_CAPACITY = 16; // must be power of 2
    public static readonly INITIAL_BUCKET_CAPACITY = 8;
    public static readonly LOAD_FACTOR: number = 0.75;

    protected readonly comparator: EqualityComparator<T>;

    protected buckets: Array<Array<T | null>>;

    /** How many elements in set */
    protected n = 0;

    protected currentPrime = 1; // jump by 4 primes each expand or whatever

    /** when to expand */
    protected threshold: number;
    protected readonly initialCapacity: number;
    protected readonly initialBucketCapacity: number;

    protected SetIterator = (($outer) => {
        return class SetIterator extends JavaObject implements java.util.Iterator<T> {
            protected readonly data: T[];
            protected nextIndex = 0;
            protected removed = true;

            public constructor(data: T[]) {
                super();
                this.data = data;
            }

            public hasNext = (): boolean => {
                return this.nextIndex < this.data.length;
            };

            public next = (): T => {
                if (!this.hasNext()) {
                    throw new java.lang.NoSuchElementException();
                }

                this.removed = false;

                return this.data[this.nextIndex++];
            };

            public remove = (): void => {
                if (this.removed) {
                    throw new java.lang.IllegalStateException();
                }

                $outer.remove(this.data[this.nextIndex - 1]);
                this.removed = true;
            };
        };
    })(this);

    public constructor(comparator?: EqualityComparator<T>, initialCapacity?: number, initialBucketCapacity?: number) {
        super();

        this.comparator = comparator ?? ObjectEqualityComparator.INSTANCE;

        this.initialCapacity = initialCapacity ?? Array2DHashSet.INITIAL_CAPACITY;
        this.initialBucketCapacity = initialBucketCapacity ?? Array2DHashSet.INITIAL_BUCKET_CAPACITY;
        this.buckets = this.createBuckets(this.initialCapacity);
        this.threshold = Number(Math.floor(this.initialCapacity * Array2DHashSet.LOAD_FACTOR));
    }

    public *[Symbol.iterator](): IterableIterator<T> {
        yield* this.toArray();
    }

    /**
     * Add {@code o} to set if not there; return existing value if already
     * there. This method performs the same operation as {@link #add} aside from
     * the return value.
     *
     * @param o tbd
     *
     * @returns tbd
     */
    public readonly getOrAdd = (o: T): T => {
        if (this.n > this.threshold) {
            this.expand();
        }

        return this.getOrAddImpl(o);
    };

    public get = (o: T | null): T | null => {
        if (o === null) {
            return o;
        }

        const b: number = this.getBucket(o);
        const bucket = this.buckets[b];
        if (bucket === null) {
            return null;
        }

        // no bucket
        for (const e of bucket) {
            if (e === null) {
                return null;
            }

            // empty slot; not there
            if (this.comparator.equals(e, o)) {
                return e;
            }

        }

        return null;
    };

    public hashCode = (): number => {
        let hash: number = MurmurHash.initialize();
        for (const bucket of this.buckets) {
            if (bucket === null) {
                continue;
            }

            for (const o of bucket) {
                if (o === null) {
                    break;
                }

                hash = MurmurHash.update(hash, this.comparator.hashCode(o));
            }
        }

        hash = MurmurHash.finish(hash, this.size());

        return hash;
    };

    public equals = (o: unknown): boolean => {
        if (o === this) {
            return true;
        }

        if (!(o instanceof Array2DHashSet)) {
            return false;
        }

        if (o.size() !== this.size()) {
            return false;
        }

        return this.containsAll(o);
    };

    public readonly add = (t: T): boolean => {
        const existing = this.getOrAdd(t);

        return existing === t;
    };

    public readonly size = (): number => {
        return this.n;
    };

    public readonly isEmpty = (): boolean => {
        return this.n === 0;
    };

    public readonly contains = (o: T): boolean => {
        return this.containsFast(this.asElementType(o));
    };

    public containsFast = (obj: T | null): boolean => {
        if (obj === null) {
            return false;
        }

        return this.get(obj) !== null;
    };

    public iterator = (): java.util.Iterator<T> => {
        return new this.SetIterator(this.toArray());
    };

    public toArray(): T[];
    public toArray<U extends T>(a: U[]): U[];
    public toArray<U extends T>(a?: U[]): T[] | U[] {
        if (a === undefined) {
            const a = this.createBucket(this.size());
            let i = 0;
            for (const bucket of this.buckets) {
                if (bucket === null) {
                    continue;
                }

                for (const o of bucket) {
                    if (o === null) {
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
                if (bucket === null) {
                    continue;
                }

                for (const o of bucket) {
                    if (o === null) {
                        break;
                    }

                    const targetElement = o as U;
                    a[i++] = targetElement;
                }
            }

            return a;
        }
    }

    public readonly remove = (o: java.lang.Object): boolean => {
        return this.removeFast(this.asElementType(o));
    };

    public removeFast = (obj: T | null): boolean => {
        if (obj === null) {
            return false;
        }

        const b: number = this.getBucket(obj);
        const bucket = this.buckets[b];
        if (bucket === null) {
            // no bucket
            return false;
        }

        for (let i = 0; i < bucket.length; i++) {
            const e = bucket[i];
            if (e === null) {
                // empty slot; not there
                return false;
            }

            if (this.comparator.equals(e, obj)) { // found it
                // shift all elements to the right down one
                java.lang.System.arraycopy(bucket, i + 1, bucket, i, bucket.length - i - 1);
                bucket[bucket.length - 1] = null;
                this.n--;

                return true;
            }
        }

        return false;
    };

    public containsAll = (collection: java.util.Collection<T>): boolean => {
        if (collection instanceof Array2DHashSet) {
            const s = collection as Array2DHashSet<T>;
            for (const bucket of s.buckets) {
                if (bucket === null) {
                    continue;
                }

                for (const o of bucket) {
                    if (o === null) {
                        break;
                    }

                    if (!this.containsFast(this.asElementType(o))) {
                        return false;
                    }

                }
            }
        } else {
            for (const o of collection) {
                if (!this.containsFast(this.asElementType(o))) {
                    return false;
                }

            }
        }

        return true;
    };

    public addAll = (c: java.util.Collection<T>): boolean => {
        let changed = false;
        for (const o of c) {
            const existing: T = this.getOrAdd(o);
            if (existing !== o) {
                changed = true;
            }

        }

        return changed;
    };

    public retainAll = (c: java.util.Collection<T>): boolean => {
        let newSize = 0;
        for (const bucket of this.buckets) {
            if (bucket === null) {
                continue;
            }

            let i: number;
            let j: number;
            for (i = 0, j = 0; i < bucket.length; i++) {
                if (bucket[i] === null) {
                    break;
                }

                if (!c.contains(bucket[i]!)) {
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
                bucket[j] = null;
                j++;
            }
        }

        const changed = newSize !== this.n;
        this.n = newSize;

        return changed;
    };

    public removeAll = (c: java.util.Collection<T>): boolean => {
        let changed = false;
        for (const o of c) {
            changed ||= this.removeFast(this.asElementType(o));
        }

        return changed;
    };

    public clear = (): void => {
        this.n = 0;
        this.buckets = this.createBuckets(this.initialCapacity);
        this.threshold = Number(Math.floor(this.initialCapacity * Array2DHashSet.LOAD_FACTOR));
    };

    public toString = (): java.lang.String => {
        if (this.size() === 0) {
            return S`{}`;
        }

        const buf: java.lang.StringBuilder = new java.lang.StringBuilder();
        buf.append("{");
        let first = true;
        for (const bucket of this.buckets) {
            if (bucket === null) {
                continue;
            }

            for (const o of bucket) {
                if (o === null) {
                    break;
                }

                if (first) {
                    first = false;
                } else {
                    buf.append(S`, `);
                }

                buf.append(`${o}`);
            }
        }
        buf.append("}");

        return buf.toString();
    };

    public toTableString = (): java.lang.String => {
        const buf = new java.lang.StringBuilder();
        for (const bucket of this.buckets) {
            if (bucket === null) {
                buf.append(S`null\n`);
                continue;
            }

            buf.append("[");
            let first = true;
            for (const o of bucket) {
                if (first) {
                    first = false;
                } else {
                    buf.append(S` `);
                }

                if (o === null) {
                    buf.append(S`_`);
                } else {
                    buf.append(`${o}`);
                }

            }
            buf.append(S`]\n`);
        }

        return buf.toString();
    };

    protected readonly getBucket = (o: T): number => {
        const hash: number = this.comparator.hashCode(o);
        const b: number = hash & (this.buckets.length - 1); // assumes len is power of 2

        return b;
    };

    protected expand = (): void => {
        const old = this.buckets;
        this.currentPrime += 4;
        const newCapacity: number = this.buckets.length * 2;
        const newTable: T[][] = this.createBuckets(newCapacity);
        const newBucketLengths = new Array<number>(newTable.length);
        this.buckets = newTable;
        this.threshold = newCapacity * Array2DHashSet.LOAD_FACTOR;

        // rehash all existing entries
        for (const bucket of old) {
            if (bucket === null) {
                continue;
            }

            for (const o of bucket) {
                if (o === null) {
                    break;
                }

                const b = this.getBucket(o);
                const bucketLength = newBucketLengths[b];
                let newBucket: T[];
                if (bucketLength === 0) {
                    // new bucket
                    newBucket = this.createBucket(this.initialBucketCapacity);
                    newTable[b] = newBucket;
                } else {
                    newBucket = newTable[b];
                    if (bucketLength === newBucket.length) {
                        // expand
                        newBucket = java.util.Arrays.copyOf(newBucket, newBucket.length * 2);
                        newTable[b] = newBucket;
                    }
                }

                newBucket[bucketLength] = o;
                newBucketLengths[b]++;
            }
        }
    };

    protected getOrAddImpl = (o: T): T => {
        const b = this.getBucket(o);
        let bucket = this.buckets[b];

        // NEW BUCKET
        if (bucket === null) {
            bucket = this.createBucket(this.initialBucketCapacity);
            bucket[0] = o;
            this.buckets[b] = bucket;
            this.n++;

            return o;
        }

        // LOOK FOR IT IN BUCKET
        for (let i = 0; i < bucket.length; i++) {
            const existing = bucket[i];
            if (existing === null) { // empty slot; not there, add.
                bucket[i] = o;
                this.n++;

                return o;
            }
            if (this.comparator.equals(existing, o)) {
                return existing;
            }
            // found existing, quit
        }

        // FULL BUCKET, expand and add to end
        const oldLength: number = bucket.length;
        bucket = java.util.Arrays.copyOf(bucket, bucket.length * 2);
        this.buckets[b] = bucket;
        bucket[oldLength] = o; // add to end
        this.n++;

        return o;
    };

    /**
     * Return {@code o} as an instance of the element type {@code T}. If
     * {@code o} is non-null but known to not be an instance of {@code T}, this
     * method returns {@code null}. The base implementation does not perform any
     * type checks; override this method to provide strong type checks for the
     * {@link #contains} and {@link #remove} methods to ensure the arguments to
     * the {@link EqualityComparator} for the set always have the expected
     * types.
     *
     * @param o the object to try and cast to the element type of the set
      @returns `o` if it could be an instance of {@code T}, otherwise
     * {@code null}.
     */
    protected asElementType = (o: java.lang.Object | null): T | null => {
        return o as T;
    };

    /**
     * Return an array of {@code T[]} with length {@code capacity}.
     *
     * @param capacity the length of the array to return
      @returns the newly constructed array
     */
    protected createBuckets = (capacity: number): T[][] => {
        return new Array<T[]>(capacity);
    };

    /**
     * Return an array of {@code T} with length {@code capacity}.
     *
     * @param capacity the length of the array to return
      @returns the newly constructed array
     */
    protected createBucket = (capacity: number): T[] => {
        return new Array<T>(capacity);
    };

}
