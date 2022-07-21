/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/*
 eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/naming-convention, no-redeclare,
 max-classes-per-file, jsdoc/check-tag-names, @typescript-eslint/no-empty-function,
 @typescript-eslint/restrict-plus-operands, @typescript-eslint/unified-signatures, @typescript-eslint/member-ordering,
 no-underscore-dangle, max-len
*/

/* cspell: disable */

import { java } from "../../../../../../lib/java/java";
import { IEquatable } from "../../../../../../lib/types";

import { EqualityComparator } from "./EqualityComparator";
import { HashableType, MurmurHash } from "./MurmurHash";
import { ObjectEqualityComparator } from "./ObjectEqualityComparator";

/**
 * A limited map (many unsupported operations) that lets me use
 *  varying hashCode/equals.
 */
export class FlexibleHashMap<K extends IEquatable, V extends HashableType> {
    public static readonly INITAL_CAPACITY: number = 16; // must be power of 2
    public static readonly INITAL_BUCKET_CAPACITY: number = 8;
    public static readonly LOAD_FACTOR: number = 0.75;

    public static Entry = class Entry<K, V> {
        public readonly key?: K;
        public value?: V;

        public constructor(key: K, value: V) { this.key = key; this.value = value; }

        public toString = (): string => {
            return this.key.toString() + ":" + this.value.toString();
        };
    };

    protected readonly comparator?: EqualityComparator<K>;

    protected buckets?: Array<Array<FlexibleHashMap.Entry<K, V>>>;

    /** How many elements in set */
    protected n = 0;

    protected threshold = Number((FlexibleHashMap.INITAL_CAPACITY * FlexibleHashMap.LOAD_FACTOR)); // when to expand

    protected currentPrime = 1; // jump by 4 primes each expand or whatever
    protected initialBucketCapacity: number = FlexibleHashMap.INITAL_BUCKET_CAPACITY;

    public constructor();
    public constructor(comparator: EqualityComparator<K>);
    public constructor(comparator: EqualityComparator<K>, initialCapacity: number, initialBucketCapacity: number);
    public constructor(comparator?: EqualityComparator<K>, _initialCapacity = FlexibleHashMap.INITAL_CAPACITY,
        initialBucketCapacity = FlexibleHashMap.INITAL_BUCKET_CAPACITY) {
        if (comparator === undefined) {
            comparator = ObjectEqualityComparator.INSTANCE;
        }

        this.comparator = comparator;
        this.buckets = FlexibleHashMap.createEntryListArray(initialBucketCapacity);
        this.initialBucketCapacity = initialBucketCapacity;
    }

    private static createEntryListArray = <K, V>(length: number): Array<Array<FlexibleHashMap.Entry<K, V>>> => {
        return new Array<Array<FlexibleHashMap.Entry<K, V>>>(length);
    };

    protected getBucket = (key: K): number => {
        const hash = this.comparator.hashCode(key);
        const b = hash & (this.buckets.length - 1); // assumes len is power of 2

        return b;
    };

    public get = (key: K): V => {
        const b = this.getBucket(key);
        const bucket = this.buckets[b];
        if (bucket === undefined) {
            return undefined;
        }

        for (const e of bucket) {
            if (this.comparator.equals(e.key, key)) {
                return e.value;
            }
        }

        return undefined;
    };

    public put = (key: K, value: V): V => {
        if (this.n > this.threshold) {
            this.expand();
        }

        const b: number = this.getBucket(key);
        let bucket: Array<FlexibleHashMap.Entry<K, V>> = this.buckets[b];
        if (bucket === undefined) {
            bucket = this.buckets[b] = [];
        }

        for (const e of bucket) {
            if (this.comparator.equals(e.key, key)) {
                const prev: V = e.value;
                e.value = value;
                this.n++;

                return prev;
            }
        }

        // not there
        bucket.push(new FlexibleHashMap.Entry<K, V>(key, value));
        this.n++;

        return undefined;
    };

    public remove = (_key: object): V => {
        throw new java.lang.UnsupportedOperationException();
    };

    public putAll = (_m: Map<K, V>): void => {
        throw new java.lang.UnsupportedOperationException();
    };

    public keySet = (): Set<K> => {
        throw new java.lang.UnsupportedOperationException();
    };

    public values = (): java.util.Collection<V> => {
        const a: java.util.List<V> = new java.util.ArrayList<V>(this.size());
        for (const bucket of this.buckets) {
            if (bucket === undefined) {
                continue;
            }

            for (const e of bucket) {
                a.add(e.value);
            }
        }

        return a;
    };

    public entrySet = (): Set<FlexibleHashMap.Entry<K, V>> => {
        throw new java.lang.UnsupportedOperationException();
    };

    public containsKey = (key: K): boolean => {
        return this.get(key) !== undefined;
    };

    public containsValue = (_value: V): boolean => {
        throw new java.lang.UnsupportedOperationException();
    };

    public hashCode = (): number => {
        let hash = MurmurHash.initialize();
        for (const bucket of this.buckets) {
            if (bucket === undefined) {
                continue;
            }

            for (const e of bucket) {
                if (e === undefined) {
                    break;
                }

                hash = MurmurHash.update(hash, this.comparator.hashCode(e.key));
            }
        }

        hash = MurmurHash.finish(hash, this.size());

        return hash;
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
            if (bucket === undefined) {
                continue;
            }

            for (const e of bucket) {
                if (e === undefined) {
                    break;
                }

                this.put(e.key, e.value);
            }
        }
        this.n = oldSize;
    };

    public size = (): number => {
        return this.n;
    };

    public isEmpty = (): boolean => {
        return this.n === 0;
    };

    public clear = (): void => {
        this.buckets = FlexibleHashMap.createEntryListArray(FlexibleHashMap.INITAL_CAPACITY);
        this.n = 0;
    };

    public toString = (): string => {
        if (this.size() === 0) {
            return "{}";
        }

        const buf: java.lang.StringBuilder = new java.lang.StringBuilder();
        buf.append("{");
        let first = true;
        for (const bucket of this.buckets) {
            if (bucket === undefined) {
                continue;
            }

            for (const e of bucket) {
                if (e === undefined) {
                    break;
                }

                if (first) {
                    first = false;
                } else {
                    buf.append(", ");
                }

                buf.append(e.toString());
            }
        }
        buf.append("}");

        return buf.toString();
    };

    public toTableString = (): string => {
        const buf: java.lang.StringBuilder = new java.lang.StringBuilder();
        for (const bucket of this.buckets) {
            if (bucket === undefined) {
                buf.append("null\n");
                continue;
            }
            buf.append("[");
            let first = true;
            for (const e of bucket) {
                if (first) {
                    first = false;
                } else {
                    buf.append(" ");
                }

                if (e === undefined) {
                    buf.append("_");
                } else {
                    buf.append(e.toString());
                }

            }
            buf.append("]\n");
        }

        return buf.toString();
    };
}

namespace FlexibleHashMap {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    export type Entry<K, V> = InstanceType<typeof FlexibleHashMap.Entry<K, V>>;
}

