/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/*
 eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/naming-convention,
 max-classes-per-file, jsdoc/check-tag-names, @typescript-eslint/no-empty-function,
 @typescript-eslint/restrict-plus-operands, @typescript-eslint/unified-signatures, @typescript-eslint/member-ordering,
 no-underscore-dangle
*/

/* cspell: disable */

import { java } from "../../../../../../lib/java/java";
import { AbstractEqualityComparator } from "./AbstractEqualityComparator";
import { MurmurHash } from "./MurmurHash";
import { ObjectEqualityComparator } from "./ObjectEqualityComparator";

/**
 * A limited map (many unsupported operations) that lets me use
 *  varying hashCode/equals.
 */
export class FlexibleHashMap<K, V> implements Map<K, V> {
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

    protected readonly comparator?: AbstractEqualityComparator<K>;

    protected buckets?: Array<LinkedList<Entry<K, V>>>;

    /** How many elements in set */
    protected n = 0;

    protected threshold = Number((FlexibleHashMap.INITAL_CAPACITY * FlexibleHashMap.LOAD_FACTOR)); // when to expand

    protected currentPrime = 1; // jump by 4 primes each expand or whatever
    protected initialBucketCapacity: number = FlexibleHashMap.INITAL_BUCKET_CAPACITY;

    public constructor();

    public constructor(comparator: AbstractEqualityComparator<K>);

    public constructor(comparator: AbstractEqualityComparator<K>, initialCapacity: number, initialBucketCapacity: number);
    public constructor(comparator?: AbstractEqualityComparator<K>, initialCapacity?: number, initialBucketCapacity?: number) {
        const $this = (comparator?: AbstractEqualityComparator<K>, initialCapacity?: number, initialBucketCapacity?: number): void => {
            if (comparator === undefined) {
                $this(undefined, FlexibleHashMap.INITAL_CAPACITY, FlexibleHashMap.INITAL_BUCKET_CAPACITY);
            } else if (comparator instanceof AbstractEqualityComparator && initialCapacity === undefined) {
                $this(comparator, FlexibleHashMap.INITAL_CAPACITY, FlexibleHashMap.INITAL_BUCKET_CAPACITY);
            } else {
                if (comparator === undefined) {
                    comparator = ObjectEqualityComparator.INSTANCE;
                }

                this.comparator = comparator;
                this.buckets = FlexibleHashMap.createEntryListArray(initialBucketCapacity);
                this.initialBucketCapacity = initialBucketCapacity;
            }
        };

        $this(comparator, initialCapacity, initialBucketCapacity);

    }

    private static createEntryListArray = <K, V>(length: number): Array<LinkedList<Entry<K, V>>> => {
        /* @SuppressWarnings("unchecked") */
        const result: Array<LinkedList<Entry<K, V>>> = new Array<LinkedList<unknown>>(length) as Array<LinkedList<Entry<K, V>>>;

        return result;
    };

    protected getBucket = (key: K): number => {
        const hash: number = this.comparator.hashCode(key);
        const b: number = hash & (this.buckets.length - 1); // assumes len is power of 2

        return b;
    };

    public get = (key: object): V => {
        /* @SuppressWarnings("unchecked") */
        const typedKey: K = key as K;
        if (key === undefined) {
            return undefined;
        }

        const b: number = this.getBucket(typedKey);
        const bucket: LinkedList<Entry<K, V>> = this.buckets[b];
        if (bucket === undefined) {
            return undefined;
        }
        // no bucket
        for (const e of bucket) {
            if (this.comparator.equals(e.key, typedKey)) {
                return e.value;
            }
        }

        return undefined;
    };

    public put = (key: K, value: V): V => {
        if (key === undefined) {
            return undefined;
        }

        if (this.n > this.threshold) {
            this.expand();
        }

        const b: number = this.getBucket(key);
        let bucket: LinkedList<Entry<K, V>> = this.buckets[b];
        if (bucket === undefined) {
            bucket = this.buckets[b] = new LinkedList<Entry<K, V>>();
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
        bucket.add(new this.Entry<K, V>(key, value));
        this.n++;

        return undefined;
    };

    public remove = (key: object): V => {
        throw new java.lang.UnsupportedOperationException();
    };

    public putAll = (m: Map<K, V>): void => {
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

    public entrySet = (): Set<Map.Entry<K, V>> => {
        throw new java.lang.UnsupportedOperationException();
    };

    public containsKey = (key: object): boolean => {
        return this.get(key) !== undefined;
    };

    public containsValue = (value: object): boolean => {
        throw new java.lang.UnsupportedOperationException();
    };

    public hashCode = (): number => {
        let hash: number = MurmurHash.initialize();
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

    public equals = (o: object): boolean => {
        throw new java.lang.UnsupportedOperationException();
    };

    protected expand = (): void => {
        const old: Array<LinkedList<Entry<K, V>>> = this.buckets;
        this.currentPrime += 4;
        const newCapacity: number = this.buckets.length * 2;
        const newTable: Array<LinkedList<Entry<K, V>>> = FlexibleHashMap.createEntryListArray(newCapacity);
        this.buckets = newTable;
        this.threshold = Number((newCapacity * FlexibleHashMap.LOAD_FACTOR));
        //		System.out.println("new size="+newCapacity+", thres="+threshold);
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

    public static main = (args: string[]): void => {
        const map: FlexibleHashMap<string, java.lang.Integer> = new FlexibleHashMap<string, java.lang.Integer>();
        map.put("hi", 1);
        map.put("mom", 2);
        map.put("foo", 3);
        map.put("ach", 4);
        map.put("cbba", 5);
        map.put("d", 6);
        map.put("edf", 7);
        map.put("mom", 8);
        map.put("hi", 9);
        java.lang.System.out.println(map);
        java.lang.System.out.println(map.toTableString());
    };
}

namespace FlexibleHashMap {

    export type Entry = InstanceType<typeof FlexibleHashMap["Entry"]>;
}

