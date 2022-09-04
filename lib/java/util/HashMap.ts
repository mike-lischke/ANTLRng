/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { java } from "../java";

import { HashSet } from "./HashSet";
import { NotImplementedError } from "../../NotImplementedError";
import { HashMapEntry } from "./HashMapEntry";
import { HashMapEqualityComparator } from "./HashMapEqualityComparator";

/**
 * This implementation was taken from the ANTLR4 Array2DHashMap implementation and adjusted to fulfill the
 * more general Java HashMap implementation.
 */
export class HashMap<K, V> implements java.lang.Cloneable<HashMap<K, V>>, java.io.Serializable,
    Iterable<java.util.Map.Entry<K, V>>, java.util.Map<K, V> {

    // eslint-disable-next-line @typescript-eslint/naming-convention
    private HashSetBackingStore = class extends HashSet<HashMapEntry<K, V>> {
        public constructor(initialCapacity?: number, loadFactor?: number) {
            super(initialCapacity, loadFactor);

            this.comparator = HashMapEqualityComparator.instance;
        }
    };

    private backingStore: HashSet<HashMapEntry<K, V>>;

    public constructor(initialCapacity?: number, loadFactor?: number);
    public constructor(map: java.util.Map<K, V>);
    public constructor(initialCapacityOrMap?: number | java.util.Map<K, V>, loadFactor?: number) {
        if (typeof initialCapacityOrMap === "number") {
            this.backingStore = new this.HashSetBackingStore(initialCapacityOrMap, loadFactor);
        } else {
            this.backingStore = new this.HashSetBackingStore();
            if (initialCapacityOrMap) {
                this.putAll(initialCapacityOrMap);
            }
        }
    }

    public *[Symbol.iterator](): IterableIterator<java.util.Map.Entry<K, V>> {
        yield* this.backingStore.toArray();
    }

    public clear(): void {
        this.backingStore.clear();
    }

    public clone(): HashMap<K, V> {
        return new HashMap<K, V>(this);
    }

    public containsKey(key: K): boolean {
        const entry = new HashMapEntry<K, V>(key, null);

        return this.backingStore.contains(entry);
    }

    public containsValue(_value: V): boolean {
        throw new NotImplementedError();
    }

    /**
     * @deprecated Use the iterator instead.
     */
    public entrySet(): java.util.Set<java.util.Map.Entry<K, V>> {
        throw new NotImplementedError();
    }

    public get(key: K): V | undefined {
        const entry = new HashMapEntry<K, V>(key, null);

        const bucket = this.backingStore.get(entry);
        if (!bucket) {
            return undefined;
        }

        return bucket.getValue();
    }

    public isEmpty(): boolean {
        return this.backingStore.isEmpty();
    }

    /**
     * @deprecated Use the iterator instead.
     */
    public keySet(): java.util.Set<K> {
        throw new NotImplementedError();
    }

    public put(key: K, value: V): V | undefined {
        const entry = new HashMapEntry(key, value);
        const element = this.backingStore.get(entry);
        let result: V | undefined;
        if (!element) {
            this.backingStore.add(entry);
        } else {
            result = element.setValue(value);
        }

        return result;
    }

    public putAll(map: java.util.Map<K, V>): void {
        if (map instanceof HashMap) {
            this.backingStore.addAll(map.backingStore);
        } else {
            const entries = map.entrySet();
            for (const entry of entries) {
                this.backingStore.add(entry as HashMapEntry<K, V>);
            }
        }
    }

    /**
     * This variation of the put method does not replace the value, if a key already exists.
     *
     * @param key The key to look up.
     * @param value The value to store under the given key.
     *
     * @returns undefined, if the given key is not in the map, otherwise just the given value.
     */
    public putIfAbsent(key: K, value: V): V | undefined {
        const entry = new HashMapEntry(key, value);
        const element = this.backingStore.get(entry);
        let result: V | undefined;
        if (!element) {
            this.backingStore.add(entry);
        } else {
            result = value;
        }

        return result;
    }

    public remove(key: K): V | undefined {
        const entry = new HashMapEntry<K, V>(key, null);

        const result = this.backingStore.get(entry);
        if (result) {
            this.backingStore.remove(result);

            return result.getValue();
        }

        return undefined;
    }

    public size(): number {
        return this.backingStore.size();
    }

    public hashCode(): number {
        return this.backingStore.hashCode();
    }

    public equals(o: unknown): boolean {
        if (!(o instanceof HashMap)) {
            return false;
        }

        return this.backingStore.equals(o.backingStore);
    }

    /**
     * @deprecated Use the iterator instead.
     */
    public values(): java.util.Collection<V> {
        throw new NotImplementedError();
    }
}
