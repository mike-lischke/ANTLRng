/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/*
 eslint-disable @typescript-eslint/naming-convention, no-redeclare,
 max-classes-per-file, jsdoc/check-tag-names, @typescript-eslint/no-empty-function,
 @typescript-eslint/restrict-plus-operands, @typescript-eslint/unified-signatures, @typescript-eslint/member-ordering,
 no-underscore-dangle, max-len
*/

import { java } from "../../../../../../lib/java/java";
import { IEquatable } from "../../../../../../lib/types";

import { AbstractEqualityComparator } from "./AbstractEqualityComparator";
import { MurmurHash } from "./MurmurHash";
import { ObjectEqualityComparator } from "./ObjectEqualityComparator";

/** {@link Set} implementation with closed hashing (open addressing). */
export class Array2DHashSet<T extends IEquatable> implements java.util.Collection<T> {
    public static readonly INITIAL_CAPACITY: number = 16; // must be power of 2
    public static readonly INITIAL_BUCKET_CAPACITY: number = 8;
    public static readonly LOAD_FACTOR: number = 0.75;

    protected readonly comparator?: AbstractEqualityComparator<T>;

    protected buckets?: T[][];

    /** How many elements in set */
    protected n = 0;

    protected threshold = Number(Math.floor(Array2DHashSet.INITIAL_CAPACITY * Array2DHashSet.LOAD_FACTOR)); // when to expand

    protected currentPrime = 1; // jump by 4 primes each expand or whatever
    protected initialBucketCapacity: number = Array2DHashSet.INITIAL_BUCKET_CAPACITY;

    public constructor();
    public constructor(comparator: AbstractEqualityComparator<T>);
    public constructor(comparator: AbstractEqualityComparator<T>, initialCapacity: number, initialBucketCapacity: number);
    public constructor(comparator?: AbstractEqualityComparator<T>, initialCapacity?: number, initialBucketCapacity?: number) {
        const $this = (comparator?: AbstractEqualityComparator<T>, initialCapacity?: number, initialBucketCapacity?: number): void => {
            if (initialCapacity === undefined) {
                $this(comparator, Array2DHashSet.INITIAL_CAPACITY, Array2DHashSet.INITIAL_BUCKET_CAPACITY);
            } else {
                if (comparator === undefined) {
                    comparator = ObjectEqualityComparator.INSTANCE;
                }

                // @ts-ignore
                this.comparator = comparator;
                this.buckets = this.createBuckets(initialCapacity);
                this.initialBucketCapacity = initialBucketCapacity;
            }
        };

        $this(comparator, initialCapacity, initialBucketCapacity);

    }

    public [Symbol.iterator](): IterableIterator<T> {
        let index = 0;
        const data = this.toArray();

        return {
            next: () => {
                return {
                    done: index === data.length,
                    value: data[index++],
                };
            },
        } as IterableIterator<T>;

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
    public readonly getOrAdd = (o: T): T => {
        if (this.n > this.threshold) {
            this.expand();
        }

        return this.getOrAddImpl(o);
    };

    protected getOrAddImpl = (o: T): T => {
        const b: number = this.getBucket(o);
        let bucket: T[] = this.buckets[b];

        // NEW BUCKET
        if (bucket === undefined) {
            bucket = this.createBucket(this.initialBucketCapacity);
            bucket[0] = o;
            this.buckets[b] = bucket;
            this.n++;

            return o;
        }

        // LOOK FOR IT IN BUCKET
        for (let i = 0; i < bucket.length; i++) {
            const existing: T = bucket[i];
            if (existing === undefined) { // empty slot; not there, add.
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

    public get = (o: T): T => {
        if (o === undefined) {
            return o;
        }

        const b: number = this.getBucket(o);
        const bucket: T[] = this.buckets[b];
        if (bucket === undefined) {
            return undefined;
        }
        // no bucket
        for (const e of bucket) {
            if (e === undefined) {
                return undefined;
            }
            // empty slot; not there
            if (this.comparator.equals(e, o)) {
                return e;
            }

        }

        return undefined;
    };

    protected readonly getBucket = (o: T): number => {
        const hash: number = this.comparator.hashCode(o);
        const b: number = hash & (this.buckets.length - 1); // assumes len is power of 2

        return b;
    };

    public hashCode = (): number => {
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
    };

    public equals = (o: unknown): boolean => {
        if (o === this) {
            return true;
        }

        if (!(o instanceof Array2DHashSet)) {
            return false;
        }

        const other = o as Array2DHashSet<T>;
        if (other.size !== this.size) {
            return false;
        }

        return this.containsAll(other);
    };

    protected expand = (): void => {
        const old: T[][] = this.buckets;
        this.currentPrime += 4;
        const newCapacity: number = this.buckets.length * 2;
        const newTable: T[][] = this.createBuckets(newCapacity);
        const newBucketLengths: number[] = new Array<number>(newTable.length);
        this.buckets = newTable;
        this.threshold = Number((newCapacity * Array2DHashSet.LOAD_FACTOR));

        for (const bucket of old) {
            if (bucket === undefined) {
                continue;
            }

            for (const o of bucket) {
                if (o === undefined) {
                    break;
                }

                const b: number = this.getBucket(o);
                const bucketLength: number = newBucketLengths[b];
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

        /* assert n == oldSize; */
    };

    public add = (t: T): boolean => {
        const existing: T = this.getOrAdd(t);

        return existing === t;
    };

    public size = (): number => {
        return this.n;
    };

    public readonly isEmpty = (): boolean => {
        return this.n === 0;
    };

    public readonly contains = (o: unknown): boolean => {
        return this.containsFast(this.asElementType(o));
    };

    public containsFast = (obj: T): boolean => {
        if (obj === undefined) {
            return false;
        }

        return this.get(obj) !== undefined;
    };

    public toArray(): T[];
    public toArray<U extends T>(a: U[]): U[];
    public toArray<U extends T>(a?: U[]): T[] | U[] {
        if (a === undefined) {
            const a: T[] = this.createBucket(this.size());
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

    public readonly remove = (o: unknown): boolean => {
        return this.removeFast(this.asElementType(o));
    };

    public removeFast = (obj: T): boolean => {
        if (obj === undefined) {
            return false;
        }

        const b: number = this.getBucket(obj);
        const bucket = this.buckets[b];
        if (bucket === undefined) {
            // no bucket
            return false;
        }

        for (let i = 0; i < bucket.length; i++) {
            const e: T = bucket[i];
            if (e === undefined) {
                // empty slot; not there
                return false;
            }

            if (this.comparator.equals(e, obj)) {          // found it
                // shift all elements to the right down one
                java.lang.System.arraycopy(bucket, i + 1, bucket, i, bucket.length - i - 1);
                bucket[bucket.length - 1] = undefined;
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
                if (bucket === undefined) {
                    continue;
                }

                for (const o of bucket) {
                    if (o === undefined) {
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

    public retainAll = (c: java.util.Collection<unknown>): boolean => {
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

        const changed: boolean = newSize !== this.n;
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
        this.buckets = this.createBuckets(Array2DHashSet.INITIAL_CAPACITY);
        this.n = 0;
        this.threshold = Number(Math.floor(Array2DHashSet.INITIAL_CAPACITY * Array2DHashSet.LOAD_FACTOR));
    };

    public toString = (): string => {
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
    };

    public toTableString = (): string => {
        const buf = new java.lang.StringBuilder();
        for (const bucket of this.buckets) {
            if (bucket === undefined) {
                buf.append("null\n");
                continue;
            }
            buf.append("[");
            let first = true;
            for (const o of bucket) {
                if (first) {
                    first = false;
                } else {
                    buf.append(" ");
                }

                if (o === undefined) {
                    buf.append("_");
                } else {
                    buf.append(o.toString());
                }

            }
            buf.append("]\n");
        }

        return buf.toString();
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
     *
     * @returns `o` if it could be an instance of `T`, otherwise `null`.
     */
    protected asElementType = (o: unknown): T | null => {
        if (Array2DHashSet.isInstance(o)) {
            return o as T;
        }

        return null;
    };

    /**
     * Return an array of {@code T[]} with length {@code capacity}.
     *
     * @param capacity the length of the array to return
     *
     * @returns the newly constructed array
     */
    protected createBuckets = (capacity: number): T[][] => {
        return new Array<T[]>(capacity);
    };

    /**
     * Return an array of {@code T} with length {@code capacity}.
     *
     * @param capacity the length of the array to return
     *
     * @returns the newly constructed array
     */
    protected createBucket = (capacity: number): T[] => {
        return new Array<T>(capacity);
    };

    private static isInstance<T>(this: new (...args: unknown[]) => T, t: T): boolean {
        if (t instanceof this) {
            return true;
        } else {
            return false;
        }
    }
}
