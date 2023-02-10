/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { java, S, JavaObject, MurmurHash } from "jree";
import { ObjectEqualityComparator } from "./ObjectEqualityComparator";

import { EqualityComparator } from "./EqualityComparator";

/**
 * A limited map (many unsupported operations) that lets me use
 *  varying hashCode/equals.
 */
export class FlexibleHashMap<K extends JavaObject, V> extends JavaObject implements java.util.Map<K, V> {
    public static readonly INITIAL_CAPACITY: number = 16; // must be power of 2
    public static readonly INITIAL_BUCKET_CAPACITY: number = 8;
    public static readonly LOAD_FACTOR: number = 0.75;

    public static Entry = class Entry<K, V> extends JavaObject {
        public readonly key: K;
        public value: V;

        public constructor(key: K, value: V) {
            super();
            this.key = key;
            this.value = value;
        }

        public toString = (): java.lang.String => {
            return S`${this.key}:${this.value}`;
        };
    };

    protected readonly comparator: EqualityComparator<K>;

    protected buckets: Array<java.util.LinkedList<FlexibleHashMap.Entry<K, V>>>;

    /** How many elements in set */
    protected n = 0;

    protected currentPrime = 1; // jump by 4 primes each expand or whatever

    /** when to expand */
    protected threshold: number;
    protected readonly initialCapacity: number;
    protected readonly initialBucketCapacity: number;

    public constructor(comparator?: EqualityComparator<K>, initialCapacity?: number, initialBucketCapacity?: number) {
        super();

        this.comparator = comparator ?? ObjectEqualityComparator.INSTANCE;
        this.initialCapacity = initialCapacity ?? FlexibleHashMap.INITIAL_CAPACITY;
        this.initialBucketCapacity = initialBucketCapacity ?? FlexibleHashMap.INITIAL_BUCKET_CAPACITY;
        this.threshold = Number(Math.floor(this.initialCapacity * FlexibleHashMap.LOAD_FACTOR));
        this.buckets = FlexibleHashMap.createEntryListArray(this.initialBucketCapacity);
    }

    private static createEntryListArray =
        <K, V>(length: number): Array<java.util.LinkedList<FlexibleHashMap.Entry<K, V>>> => {
            /* @SuppressWarnings("unchecked") */
            const result = new Array<java.util.LinkedList<FlexibleHashMap.Entry<K, V>>>(length);

            return result;
        };

    public get = (key: K | null): V | null => {
        if (key === null) {
            return null;
        }

        const b = this.getBucket(key);
        const bucket = this.buckets[b];
        if (bucket === null) {
            return null;
        }

        // no bucket
        for (const e of bucket) {
            if (this.comparator.equals(e.key, key)) {
                return e.value;
            }
        }

        return null;
    };

    public put = (key: K | null, value: V): V | null => {
        if (key === null) {
            return null;
        }

        if (this.n > this.threshold) {
            this.expand();
        }

        const b = this.getBucket(key);
        let bucket = this.buckets[b];
        if (bucket === null) {
            bucket = this.buckets[b] = new java.util.LinkedList<FlexibleHashMap.Entry<K, V>>();
        }

        for (const e of bucket) {
            if (this.comparator.equals(e.key, key)) {
                const prev = e.value;
                e.value = value;
                this.n++;

                return prev;
            }
        }

        // not there
        bucket.add(new FlexibleHashMap.Entry<K, V>(key, value));
        this.n++;

        return null;
    };

    public remove = (_key: java.lang.Object | null): V | null => {
        throw new java.lang.UnsupportedOperationException();
    };

    public putAll = (_m: java.util.Map<K, V> | null): void => {
        throw new java.lang.UnsupportedOperationException();
    };

    public keySet = (): java.util.Set<K> => {
        throw new java.lang.UnsupportedOperationException();
    };

    public values = (): java.util.Collection<V> => {
        const a: java.util.List<V> = new java.util.ArrayList<V>(this.size());
        for (const bucket of this.buckets) {
            if (bucket === null) {
                continue;
            }

            for (const e of bucket) {
                a.add(e.value);
            }
        }

        return a;
    };

    public entrySet = (): java.util.Set<java.util.Map.Entry<K, V>> => {
        throw new java.lang.UnsupportedOperationException();
    };

    public containsKey = (key: K): boolean => {
        return this.get(key) !== null;
    };

    public containsValue = (_value: V): boolean => {
        throw new java.lang.UnsupportedOperationException();
    };

    public hashCode = (): number => {
        let hash: number = MurmurHash.initialize();
        for (const bucket of this.buckets) {
            if (bucket === null) {
                continue;
            }

            for (const e of bucket) {
                if (e === null) {
                    break;
                }

                hash = MurmurHash.update(hash, this.comparator.hashCode(e.key));
            }
        }

        hash = MurmurHash.finish(hash, this.size());

        return hash;
    };

    public equals = (_o: unknown): boolean => {
        throw new java.lang.UnsupportedOperationException();
    };

    public size = (): number => {
        return this.n;
    };

    public isEmpty = (): boolean => {
        return this.n === 0;
    };

    public clear = (): void => {
        this.buckets = FlexibleHashMap.createEntryListArray(this.initialCapacity);
        this.n = 0;
        this.threshold = Number(Math.floor(this.initialCapacity * FlexibleHashMap.LOAD_FACTOR));
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

            for (const e of bucket) {
                if (e === null) {
                    break;
                }

                if (first) {
                    first = false;
                } else {
                    buf.append(S`, `);
                }

                buf.append(e.toString());
            }
        }
        buf.append("}");

        return buf.toString();
    };

    public toTableString = (): java.lang.String | null => {
        const buf: java.lang.StringBuilder = new java.lang.StringBuilder();
        for (const bucket of this.buckets) {
            if (bucket === null) {
                buf.append(S`null\n`);
                continue;
            }
            buf.append("[");
            let first = true;
            for (const e of bucket) {
                if (first) {
                    first = false;
                } else {
                    buf.append(S` `);
                }

                if (e === null) {
                    buf.append(S`_`);
                } else {
                    buf.append(e.toString());
                }

            }
            buf.append(S`]\n`);
        }

        return buf.toString();
    };

    protected getBucket = (key: K): number => {
        const hash = this.comparator.hashCode(key);
        const b = hash & (this.buckets.length - 1); // assumes len is power of 2

        return b;
    };

    protected expand = (): void => {
        const old = this.buckets;
        this.currentPrime += 4;

        const newCapacity: number = this.buckets.length * 2;
        const newTable = FlexibleHashMap.createEntryListArray<K, V>(newCapacity);

        this.buckets = newTable;
        this.threshold = Number((newCapacity * FlexibleHashMap.LOAD_FACTOR));

        // rehash all existing entries
        const oldSize: number = this.size();
        for (const bucket of old) {
            if (bucket === null) {
                continue;
            }

            for (const e of bucket) {
                if (e === null) {
                    break;
                }

                this.put(e.key, e.value);
            }
        }
        this.n = oldSize;
    };
}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace FlexibleHashMap {
    export type Entry<K, V> = InstanceType<typeof FlexibleHashMap.Entry<K, V>>;
}
